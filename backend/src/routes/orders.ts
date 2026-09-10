import { Router } from "express";
import { randomBytes } from "node:crypto";
import { FulfillmentStatus, PaymentMethod, PaymentStatus, ProductCategory } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAdmin } from "../middleware/admin.js";
import {
  sendCapsuleOrderNotification,
  sendCapsuleOrderConfirmation,
  sendEspressoInquiryNotification,
} from "../services/email.js";

const capsuleOrderSchema = z.object({
  customerName: z.string().trim().min(2),
  customerEmail: z.string().trim().email(),
  customerPhone: z.string().trim().min(6).max(40),
  deliveryAddress: z.string().trim().min(5).max(200),
  city: z.string().trim().min(2).max(100),
  postalCode: z.string().trim().max(20).optional(),
  paymentMethod: z.literal("CASH_ON_DELIVERY"),
  note: z.string().trim().max(500).optional(),
  items: z
    .array(
      z.object({
        productId: z.string().trim().min(1),
        quantity: z.number().int().min(1).max(100),
      }),
    )
    .min(1),
});

const espressoInquirySchema = z.object({
  customerName: z.string().trim().min(2),
  customerEmail: z.string().trim().email(),
  customerPhone: z.string().trim().min(6).max(40).optional(),
  products: z.array(z.string().trim().min(1)).min(1),
  message: z.string().trim().max(500).optional(),
});

export const ordersRouter = Router();

const configuredEurToMkdRate = Number(process.env.EUR_TO_MKD_RATE || 61.5);
const EUR_TO_MKD_RATE =
  Number.isFinite(configuredEurToMkdRate) && configuredEurToMkdRate > 0 ? configuredEurToMkdRate : 61.5;
const SHIPPING_MKD_CENTS = 12_000;
const FREE_SHIPPING_MKD_CENTS = 215_000;
const fulfillmentStatusSchema = z.object({
  status: z.nativeEnum(FulfillmentStatus),
});

ordersRouter.get("/admin", requireAdmin, async (_req, res) => {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      items: {
        include: {
          product: { select: { code: true, name: true } },
        },
      },
    },
  });

  return res.json({ success: true, data: orders });
});

ordersRouter.patch("/admin/:orderId/status", requireAdmin, async (req, res) => {
  const parsed = fulfillmentStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: "Invalid order status" });
  }

  try {
    const order = await prisma.$transaction(async (tx) => {
      const currentOrder = await tx.order.findUnique({
        where: { id: req.params.orderId },
        include: { items: { include: { product: { select: { stockQuantity: true } } } } },
      });
      if (!currentOrder) throw new Error("ORDER_NOT_FOUND");

      const commitsInventory = parsed.data.status !== FulfillmentStatus.NEW && parsed.data.status !== FulfillmentStatus.CANCELLED;
      if (commitsInventory && !currentOrder.inventoryCommittedAt) {
        for (const item of currentOrder.items) {
          if (item.product.stockQuantity === null) continue;
          const updated = await tx.product.updateMany({
            where: { id: item.productId, stockQuantity: { gte: item.quantity } },
            data: { stockQuantity: { decrement: item.quantity } },
          });
          if (updated.count !== 1) throw new Error("INSUFFICIENT_STOCK");
          await tx.product.updateMany({
            where: { id: item.productId, stockQuantity: 0 },
            data: { inStock: false },
          });
        }
      }

      if (parsed.data.status === FulfillmentStatus.CANCELLED && currentOrder.inventoryCommittedAt) {
        for (const item of currentOrder.items) {
          if (item.product.stockQuantity === null) continue;
          await tx.product.update({
            where: { id: item.productId },
            data: { stockQuantity: { increment: item.quantity } },
          });
        }
      }

      return tx.order.update({
        where: { id: currentOrder.id },
        data: {
          fulfillmentStatus: parsed.data.status,
          inventoryCommittedAt: commitsInventory ? currentOrder.inventoryCommittedAt || new Date() : null,
        },
      });
    });
    return res.json({ success: true, data: order });
  } catch (error) {
    if (error instanceof Error && error.message === "ORDER_NOT_FOUND") {
      return res.status(404).json({ success: false, error: "Order not found" });
    }
    if (error instanceof Error && error.message === "INSUFFICIENT_STOCK") {
      return res.status(409).json({ success: false, error: "Not enough stock to confirm this order" });
    }
    throw error;
  }
});

ordersRouter.post("/capsules", async (req, res) => {
  const parsed = capsuleOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: "Invalid capsule order payload",
      details: parsed.error.flatten(),
    });
  }

  const capsuleProducts = await prisma.product.findMany({
    where: { category: ProductCategory.capsules },
    select: { id: true, code: true, name: true, priceEur: true, inStock: true, stockQuantity: true },
  });
  const productsByCode = new Map(capsuleProducts.map((product) => [product.code, product]));
  const duplicateProductIds = parsed.data.items
    .map((item) => item.productId)
    .filter((productId, index, allIds) => allIds.indexOf(productId) !== index);
  if (duplicateProductIds.length > 0) {
    return res.status(400).json({
      success: false,
      error: "Each capsule product may appear only once per order",
      details: [...new Set(duplicateProductIds)],
    });
  }

  const unavailableItems = parsed.data.items.filter((item) => {
    const product = productsByCode.get(item.productId);
    return !product || !product.inStock || product.priceEur === null;
  });
  if (unavailableItems.length > 0) {
    return res.status(400).json({
      success: false,
      error: "Order contains unknown, unavailable, or unpriced capsule products",
      details: unavailableItems.map((item) => item.productId),
    });
  }

  const insufficientStockItems = parsed.data.items.filter((item) => {
    const stockQuantity = productsByCode.get(item.productId)?.stockQuantity;
    return stockQuantity !== null && stockQuantity !== undefined && item.quantity > stockQuantity;
  });
  if (insufficientStockItems.length > 0) {
    return res.status(409).json({
      success: false,
      error: "Requested quantity exceeds available stock",
      details: insufficientStockItems.map((item) => item.productId),
    });
  }

  const pricedItems = parsed.data.items.map((item) => {
    const product = productsByCode.get(item.productId)!;
    const unitPriceCents = Math.round(product.priceEur! * EUR_TO_MKD_RATE) * 100;
    return {
      productId: product.id,
      productCode: product.code,
      productName: product.name,
      quantity: item.quantity,
      unitPriceCents,
      lineTotalCents: unitPriceCents * item.quantity,
    };
  });
  const subtotalCents = pricedItems.reduce((sum, item) => sum + item.lineTotalCents, 0);
  const shippingCents = subtotalCents >= FREE_SHIPPING_MKD_CENTS ? 0 : SHIPPING_MKD_CENTS;
  const totalCents = subtotalCents + shippingCents;
  const orderNumber = `GALLA-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${randomBytes(3)
    .toString("hex")
    .toUpperCase()}`;

  const order = await prisma.order.create({
    data: {
      orderNumber,
      customerName: parsed.data.customerName,
      customerEmail: parsed.data.customerEmail,
      customerPhone: parsed.data.customerPhone,
      deliveryAddress: parsed.data.deliveryAddress,
      city: parsed.data.city,
      postalCode: parsed.data.postalCode,
      deliveryCountry: "North Macedonia",
      paymentMethod: PaymentMethod.CASH_ON_DELIVERY,
      paymentStatus: PaymentStatus.PENDING,
      subtotalCents,
      shippingCents,
      totalCents,
      currency: "MKD",
      eurToMkdRate: EUR_TO_MKD_RATE,
      note: parsed.data.note,
      items: {
        create: pricedItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPriceCents: item.unitPriceCents,
          lineTotalCents: item.lineTotalCents,
        })),
      },
    },
  });
  const emailOrder = {
      id: order.id,
      orderNumber: order.orderNumber!,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone!,
      deliveryAddress: order.deliveryAddress!,
      city: order.city!,
      postalCode: order.postalCode ?? undefined,
      deliveryCountry: order.deliveryCountry,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      subtotalCents,
      shippingCents,
      totalCents,
      currency: "MKD",
      eurToMkdRate: EUR_TO_MKD_RATE,
      note: order.note ?? undefined,
      items: pricedItems.map(({ productCode, productName, quantity, unitPriceCents, lineTotalCents }) => ({
        productId: productCode,
        productName,
        quantity,
        unitPriceCents,
        lineTotalCents,
      })),
      createdAt: order.createdAt.toISOString(),
  };
  const [notificationResult, confirmationResult] = await Promise.allSettled([
    sendCapsuleOrderNotification(emailOrder),
    sendCapsuleOrderConfirmation(emailOrder),
  ]);
  const notificationEmailSent = notificationResult.status === "fulfilled" && notificationResult.value.sent;
  const confirmationEmailSent = confirmationResult.status === "fulfilled" && confirmationResult.value.sent;
  if (notificationResult.status === "rejected") {
    console.error("Failed to send capsule order notification", notificationResult.reason);
  }
  if (confirmationResult.status === "rejected") {
    console.error("Failed to send customer order confirmation", confirmationResult.reason);
  }

  const responseData = {
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    deliveryAddress: order.deliveryAddress,
    city: order.city,
    postalCode: order.postalCode,
    deliveryCountry: order.deliveryCountry,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    subtotalCents: order.subtotalCents,
    shippingCents: order.shippingCents,
    totalCents: order.totalCents,
    currency: order.currency,
    eurToMkdRate: order.eurToMkdRate,
    note: order.note,
    items: pricedItems.map(({ productCode, productName, quantity, unitPriceCents, lineTotalCents }) => ({
      productId: productCode,
      productName,
      quantity,
      unitPriceCents,
      lineTotalCents,
    })),
    createdAt: order.createdAt,
  };

  return res.status(201).json({
    success: true,
    emailSent: notificationEmailSent,
    notificationEmailSent,
    confirmationEmailSent,
    data: responseData,
  });
});

ordersRouter.post("/espresso-inquiry", async (req, res) => {
  const parsed = espressoInquirySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: "Invalid espresso inquiry payload",
      details: parsed.error.flatten(),
    });
  }

  const espressoProducts = await prisma.product.findMany({
    where: { category: ProductCategory.espresso },
    select: { id: true, code: true },
  });
  const espressoCodeToId = new Map(espressoProducts.map((product) => [product.code, product.id]));
  const unknownProducts = parsed.data.products.filter((productCode) => !espressoCodeToId.has(productCode));
  if (unknownProducts.length > 0) {
    return res.status(400).json({
      success: false,
      error: "Inquiry contains unknown espresso product IDs",
      details: unknownProducts,
    });
  }

  const inquiry = await prisma.espressoInquiry.create({
    data: {
      customerName: parsed.data.customerName,
      customerEmail: parsed.data.customerEmail,
      customerPhone: parsed.data.customerPhone,
      message: parsed.data.message,
      products: {
        create: parsed.data.products.map((productCode) => ({
          productId: espressoCodeToId.get(productCode)!,
        })),
      },
    },
  });
  let emailSent = false;
  try {
    const emailResult = await sendEspressoInquiryNotification({
      id: inquiry.id,
      customerName: inquiry.customerName,
      customerEmail: inquiry.customerEmail,
      customerPhone: inquiry.customerPhone ?? undefined,
      products: parsed.data.products,
      message: inquiry.message ?? undefined,
      createdAt: inquiry.createdAt.toISOString(),
    });
    emailSent = emailResult.sent;
  } catch (error) {
    console.error("Failed to send espresso inquiry notification", error);
  }

  const responseData = {
    id: inquiry.id,
    customerName: inquiry.customerName,
    customerEmail: inquiry.customerEmail,
    customerPhone: inquiry.customerPhone,
    products: parsed.data.products,
    message: inquiry.message,
    createdAt: inquiry.createdAt,
  };

  return res.status(201).json({
    success: true,
    emailSent,
    data: responseData,
  });
});
