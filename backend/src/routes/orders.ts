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
        quantity: z.number().int().min(1),
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
    select: { id: true, code: true },
  });
  const productCodeToId = new Map(capsuleProducts.map((product) => [product.code, product.id]));
  const unknownItems = parsed.data.items.filter((item) => !productCodeToId.has(item.productId));
  if (unknownItems.length > 0) {
    return res.status(400).json({
      success: false,
      error: "Order contains unknown capsule product IDs",
      details: unknownItems.map((item) => item.productId),
    });
  }

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
      note: parsed.data.note,
      items: {
        create: parsed.data.items.map((item) => ({
          productId: productCodeToId.get(item.productId)!,
          quantity: item.quantity,
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
      note: order.note ?? undefined,
      items: parsed.data.items,
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
    note: order.note,
    items: parsed.data.items,
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
