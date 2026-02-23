import { Router } from "express";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { contactMessages } from "../data/store.js";
import { sendContactNotification } from "../services/email.js";
import type { ContactMessage } from "../types.js";

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
  const record: ContactMessage = {
    id: randomUUID(),
    name: payload.name,
    email: payload.email,
    subject: payload.subject,
    message: payload.message,
    createdAt: new Date().toISOString(),
  };

  contactMessages.push(record);
  let emailSent = false;
  try {
    const emailResult = await sendContactNotification(record);
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
