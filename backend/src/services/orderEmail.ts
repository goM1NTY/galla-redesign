import { readFileSync } from "node:fs";
import type { CapsuleOrder } from "../types.js";

const photos: Record<string, string> = {
  "capsules-classic": "classic-10",
  "capsules-aroma": "aroma-10",
  "capsules-classic-50x": "classic-50",
};
const escape = (value: string) => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]!));

export function buildOrderConfirmation(order: CapsuleOrder) {
  const money = (cents: number) => `${(cents / 100).toLocaleString("en-GB")} MKD`;
  const attachments = [...new Set(order.items.map((item) => photos[item.productId]).filter(Boolean))].map((photo) => ({
    filename: `${photo}.jpg`,
    content: readFileSync(new URL(`../../email-assets/${photo}.jpg`, import.meta.url)),
    contentType: "image/jpeg",
    contentId: photo,
  }));
  const rows = order.items.map((item) => {
    const photo = photos[item.productId];
    const pack = item.productId === "capsules-classic-50x" ? "50 capsules" : "10 capsules";
    return `<tr><td width="100" style="padding:18px 0;border-bottom:1px solid #e8e2dc">${photo ? `<img src="cid:${photo}" width="80" height="100" alt="${escape(item.productName)}" style="display:block;object-fit:contain">` : ""}</td><td style="padding:18px 12px;border-bottom:1px solid #e8e2dc"><strong style="font-size:16px">${escape(item.productName)}</strong><br><span style="color:#71665c;font-size:13px">${pack} · Quantity: ${item.quantity}<br>${money(item.unitPriceCents)} per pack</span></td><td align="right" style="padding:18px 0;border-bottom:1px solid #e8e2dc;font-weight:bold;white-space:nowrap">${money(item.lineTotalCents)}</td></tr>`;
  }).join("");
  const totalRow = (label: string, value: string, bold = false) => `<tr><td style="padding:8px 0;${bold ? "font-weight:bold;font-size:19px;border-top:1px solid #e8e2dc" : "color:#71665c"}">${label}</td><td align="right" style="padding:8px 0;${bold ? "font-weight:bold;font-size:19px;border-top:1px solid #e8e2dc" : ""}">${value}</td></tr>`;
  const date = new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Skopje" });
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#f5f2ee;color:#242424;font-family:Arial,Helvetica,sans-serif"><div style="display:none;max-height:0;overflow:hidden">Thank you for your order. ${escape(order.orderNumber)} · ${money(order.totalCents)}</div><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:24px 12px"><table role="presentation" width="600" cellspacing="0" cellpadding="0" style="width:100%;max-width:600px;background:#fff"><tr><td style="background:#9e0102;color:#fff;padding:28px 30px;font-family:Georgia,serif;font-size:30px">Galla Caffe</td></tr><tr><td style="padding:30px"><p style="margin:0 0 12px;font-size:12px;letter-spacing:2px;color:#9e0102">ORDER CONFIRMATION</p><h1 style="margin:0 0 16px;font-size:28px;font-weight:500">Thank you for your order.</h1><p style="line-height:1.7">Hello ${escape(order.customerName)},<br>We have received your order. Your order details are below.</p><p style="padding:16px;background:#f7f4f0;line-height:1.7"><span style="font-size:12px;color:#71665c">Order number</span><br><strong>${escape(order.orderNumber)}</strong><br><span style="font-size:13px;color:#71665c">${date}</span></p><h2 style="font-size:18px;margin:28px 0 0">Your items</h2><table role="presentation" width="100%" cellspacing="0" cellpadding="0">${rows}</table><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:18px">${totalRow("Subtotal", money(order.subtotalCents))}${totalRow("Delivery", order.shippingCents === 0 ? "Free" : money(order.shippingCents))}${totalRow("Total", money(order.totalCents), true)}</table><p style="text-align:right;color:#71665c;font-size:12px;margin-top:0">EUR ${(order.totalCents / 100 / order.eurToMkdRate).toFixed(2)} equivalent</p><h2 style="font-size:18px;margin:28px 0 12px">Delivery details</h2><p style="line-height:1.7;margin:0">${escape(order.customerName)}<br>${escape(order.deliveryAddress)}<br>${escape(order.city)}${order.postalCode ? `, ${escape(order.postalCode)}` : ""}<br>${escape(order.deliveryCountry)}<br>${escape(order.customerPhone)}</p><p style="font-size:14px;line-height:1.7"><strong>Estimated delivery:</strong> 3–5 business days after confirmation.<br><strong>Payment:</strong> Cash on delivery. Please pay the courier ${money(order.totalCents)}.</p>${order.note ? `<p style="font-size:14px;line-height:1.7"><strong>Your note:</strong><br>${escape(order.note)}</p>` : ""}<p style="margin:28px 0 0;padding-top:20px;border-top:1px solid #e8e2dc;font-size:13px;color:#71665c;line-height:1.7">Questions about your order? Reply to this email and include ${escape(order.orderNumber)}.<br>Please keep this confirmation for your records.</p></td></tr><tr><td align="center" style="padding:20px;background:#f7f4f0;color:#71665c;font-size:12px">Galla Caffe · North Macedonia</td></tr></table></td></tr></table></body></html>`;
  return { html, attachments };
}
