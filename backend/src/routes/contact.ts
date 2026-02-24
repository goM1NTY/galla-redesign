import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { sendContactNotification } from "../services/email.js";

const contactSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  subject: z.string().trim().max(150).optional(),
  message: z.string().trim().min(5),
});

export const contactRouter = Router();

contactRouter.post("/", async (req, res) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: "Invalid contact payload",
      details: parsed.error.flatten(),
    });
  }

  const payload = parsed.data;
  const record = await prisma.contactMessage.create({
    data: {
      name: payload.name,
      email: payload.email,
      subject: payload.subject,
      message: payload.message,
    },
  });

  let emailSent = false;
  try {
    const emailResult = await sendContactNotification({
      id: record.id,
      name: record.name,
      email: record.email,
      subject: record.subject ?? undefined,
      message: record.message,
      createdAt: record.createdAt.toISOString(),
    });
    emailSent = emailResult.sent;
  } catch (error) {
    console.error("Failed to send contact notification", error);
  }

  return res.status(201).json({
    success: true,
    emailSent,
    data: record,
  });
});
