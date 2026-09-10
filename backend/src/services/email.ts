import { Resend } from "resend";
import type { CapsuleOrder, ContactMessage, EspressoInquiry } from "../types.js";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const MAIL_FROM = process.env.MAIL_FROM || "onboarding@resend.dev";
const MAIL_TO = process.env.MAIL_TO || "minetamexhiti01@gmail.com";

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

async function sendEmail(to: string, subject: string, text: string) {
  if (!resend) {
    console.warn("Email skipped: RESEND_API_KEY is not configured");
    return { sent: false, reason: "missing_api_key" as const };
  }

  await resend.emails.send({
    from: MAIL_FROM,
    to: [to],
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

  return sendEmail(MAIL_TO, subject, text);
}

function formatCapsuleOrder(order: CapsuleOrder) {
  const formatMoney = (cents: number) => {
    const mkd = cents / 100;
    const eur = mkd / order.eurToMkdRate;
    return `${Math.round(mkd)} MKD / EUR ${eur.toFixed(2)}`;
  };
  const itemsText = order.items
    .map(
      (item) =>
        `- ${item.productName} x ${item.quantity}: ${formatMoney(item.lineTotalCents)} ` +
        `(${formatMoney(item.unitPriceCents)} each)`,
    )
    .join("\n");
  return [
    `Order number: ${order.orderNumber}`,
    `Customer: ${order.customerName}`,
    `Email: ${order.customerEmail}`,
    `Phone: ${order.customerPhone}`,
    `Delivery address: ${order.deliveryAddress}`,
    `City: ${order.city}`,
    `Postal code: ${order.postalCode || "-"}`,
    `Country: ${order.deliveryCountry}`,
    "Delivery time: 3–5 business days",
    `Payment method: Cash on delivery`,
    `Payment status: ${order.paymentStatus}`,
    `Note: ${order.note || "-"}`,
    "Items:",
    itemsText,
    `Subtotal: ${formatMoney(order.subtotalCents)}`,
    `Shipping: ${formatMoney(order.shippingCents)}`,
    `Total: ${formatMoney(order.totalCents)}`,
    `Created At: ${order.createdAt}`,
  ].join("\n");
}

export function sendCapsuleOrderNotification(order: CapsuleOrder) {
  const subject = `[Galla Website] Order ${order.orderNumber}: ${order.customerName}`;
  const text = ["A new capsules order was submitted.", "", formatCapsuleOrder(order)].join("\n");

  return sendEmail(MAIL_TO, subject, text);
}

export function sendCapsuleOrderConfirmation(order: CapsuleOrder) {
  const subject = `Galla order confirmation — ${order.orderNumber}`;
  const text = [
    `Hello ${order.customerName},`,
    "",
    "Thank you for your order. We have received it successfully.",
    "Payment is due in cash when your order is delivered.",
    "",
    formatCapsuleOrder(order),
    "",
    "Please keep this email for your records.",
    "Galla Caffe",
  ].join("\n");

  return sendEmail(order.customerEmail, subject, text);
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

  return sendEmail(MAIL_TO, subject, text);
}
