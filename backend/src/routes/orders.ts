import { Router } from "express";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { capsuleOrders, espressoInquiries, products } from "../data/store.js";
import {
  sendCapsuleOrderNotification,
  sendEspressoInquiryNotification,
} from "../services/email.js";
import type { CapsuleOrder, EspressoInquiry } from "../types.js";

const capsuleOrderSchema = z.object({
  customerName: z.string().trim().min(2),
  customerEmail: z.string().trim().email(),
  customerPhone: z.string().trim().min(6).max(40).optional(),
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

  const capsuleProductIds = new Set(products.filter((p) => p.category === "capsules").map((p) => p.id));
  const unknownItems = parsed.data.items.filter((item) => !capsuleProductIds.has(item.productId));
  if (unknownItems.length > 0) {
    return res.status(400).json({
      success: false,
      error: "Order contains unknown capsule product IDs",
      details: unknownItems.map((item) => item.productId),
    });
  }

  const order: CapsuleOrder = {
    id: randomUUID(),
    customerName: parsed.data.customerName,
    customerEmail: parsed.data.customerEmail,
    customerPhone: parsed.data.customerPhone,
    note: parsed.data.note,
    items: parsed.data.items,
    createdAt: new Date().toISOString(),
  };

  capsuleOrders.push(order);
  let emailSent = false;
  try {
    const emailResult = await sendCapsuleOrderNotification(order);
    emailSent = emailResult.sent;
  } catch (error) {
    console.error("Failed to send capsule order notification", error);
  }

  return res.status(201).json({
    success: true,
    emailSent,
    data: order,
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

  const espressoProductIds = new Set(products.filter((p) => p.category === "espresso").map((p) => p.id));
  const unknownProducts = parsed.data.products.filter((productId) => !espressoProductIds.has(productId));
  if (unknownProducts.length > 0) {
    return res.status(400).json({
      success: false,
      error: "Inquiry contains unknown espresso product IDs",
      details: unknownProducts,
    });
  }

  const inquiry: EspressoInquiry = {
    id: randomUUID(),
    customerName: parsed.data.customerName,
    customerEmail: parsed.data.customerEmail,
    customerPhone: parsed.data.customerPhone,
    products: parsed.data.products,
    message: parsed.data.message,
    createdAt: new Date().toISOString(),
  };

  espressoInquiries.push(inquiry);
  let emailSent = false;
  try {
    const emailResult = await sendEspressoInquiryNotification(inquiry);
    emailSent = emailResult.sent;
  } catch (error) {
    console.error("Failed to send espresso inquiry notification", error);
  }

  return res.status(201).json({
    success: true,
    emailSent,
    data: inquiry,
  });
});
