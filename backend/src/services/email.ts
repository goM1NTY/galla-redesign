import { Resend } from "resend";
import type { CapsuleOrder, ContactMessage, EspressoInquiry } from "../types.js";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const MAIL_FROM = process.env.MAIL_FROM || "onboarding@resend.dev";
const MAIL_TO = process.env.MAIL_TO || "minetamexhiti01@gmail.com";

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

async function sendEmail(subject: string, text: string) {
  if (!resend) {
    console.warn("Email skipped: RESEND_API_KEY is not configured");
    return { sent: false, reason: "missing_api_key" as const };
  }

  await resend.emails.send({
    from: MAIL_FROM,
    to: [MAIL_TO],
    subject,
    text,
  });

  return { sent: true as const };
}

export async function sendContactNotification(message: ContactMessage) {
  const subject = `[Galla Website] Contact: ${message.subject || "No Subject"}`;
  const text = [
    "A new contact message was submitted.",
    "",
    `Name: ${message.name}`,
    `Email: ${message.email}`,
    `Subject: ${message.subject || "-"}`,
    `Message: ${message.message}`,
    `Created At: ${message.createdAt}`,
  ].join("\n");

  return sendEmail(subject, text);
}

export async function sendCapsuleOrderNotification(order: CapsuleOrder) {
  const itemsText = order.items.map((item) => `- ${item.productId}: ${item.quantity}`).join("\n");
  const subject = `[Galla Website] Capsules Order: ${order.customerName}`;
  const text = [
    "A new capsules order was submitted.",
    "",
    `Customer: ${order.customerName}`,
    `Email: ${order.customerEmail}`,
    `Phone: ${order.customerPhone || "-"}`,
    `Note: ${order.note || "-"}`,
    "Items:",
    itemsText,
    `Created At: ${order.createdAt}`,
  ].join("\n");

  return sendEmail(subject, text);
}

export async function sendEspressoInquiryNotification(inquiry: EspressoInquiry) {
  const subject = `[Galla Website] Espresso Inquiry: ${inquiry.customerName}`;
  const text = [
    "A new espresso inquiry was submitted.",
    "",
    `Customer: ${inquiry.customerName}`,
    `Email: ${inquiry.customerEmail}`,
    `Phone: ${inquiry.customerPhone || "-"}`,
    `Products: ${inquiry.products.join(", ")}`,
    `Message: ${inquiry.message || "-"}`,
    `Created At: ${inquiry.createdAt}`,
  ].join("\n");

  return sendEmail(subject, text);
}
