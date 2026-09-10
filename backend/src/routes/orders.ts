import { Router } from "express";
import { PaymentMethod, PaymentStatus, ProductCategory } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import {
  sendCapsuleOrderNotification,
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
    select: { id: true, code: true, name: true, priceEur: true, inStock: true },
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

  const pricedItems = parsed.data.items.map((item) => {
    const product = productsByCode.get(item.productId)!;
    const unitPriceCents = Math.round(product.priceEur! * 100);
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
  const shippingCents = subtotalCents >= 3500 ? 0 : 390;
  const totalCents = subtotalCents + shippingCents;

  const order = await prisma.order.create({
    data: {
      customerName: parsed.data.customerName,
      customerEmail: parsed.data.customerEmail,
      customerPhone: parsed.data.customerPhone,
      deliveryAddress: parsed.data.deliveryAddress,
      city: parsed.data.city,
      postalCode: parsed.data.postalCode,
      paymentMethod: PaymentMethod.CASH_ON_DELIVERY,
      paymentStatus: PaymentStatus.PENDING,
      subtotalCents,
      shippingCents,
      totalCents,
      currency: "EUR",
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
  let emailSent = false;
  try {
    const emailResult = await sendCapsuleOrderNotification({
      id: order.id,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone!,
      deliveryAddress: order.deliveryAddress!,
      city: order.city!,
      postalCode: order.postalCode ?? undefined,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      subtotalCents,
      shippingCents,
      totalCents,
      currency: "EUR",
      note: order.note ?? undefined,
      items: pricedItems.map(({ productCode, productName, quantity, unitPriceCents, lineTotalCents }) => ({
        productId: productCode,
        productName,
        quantity,
        unitPriceCents,
        lineTotalCents,
      })),
      createdAt: order.createdAt.toISOString(),
    });
    emailSent = emailResult.sent;
  } catch (error) {
    console.error("Failed to send capsule order notification", error);
  }

  const responseData = {
    id: order.id,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    deliveryAddress: order.deliveryAddress,
    city: order.city,
    postalCode: order.postalCode,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    subtotalCents: order.subtotalCents,
    shippingCents: order.shippingCents,
    totalCents: order.totalCents,
    currency: order.currency,
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
    emailSent,
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
