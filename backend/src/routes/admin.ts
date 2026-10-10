import { Router } from "express";
import { createHash, randomBytes, randomInt } from "node:crypto";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { sendAdminLoginCode } from "../services/email.js";
export const adminRouter = Router();
export const hashAdminToken = (value: string) => createHash("sha256").update(value).digest("hex");
const emailSchema = z.string().trim().email().transform((value) => value.toLowerCase());
const requests = new Map<string, { count: number; until: number }>();
adminRouter.use((req, res, next) => {
  const key = req.ip || "unknown", now = Date.now();
  if (requests.size > 10000) for (const [ip, entry] of requests) if (entry.until < now) requests.delete(ip);
  const entry = requests.get(key);
  if (entry && entry.until > now && entry.count >= 20) return res.status(429).json({ success: false, error: "Too many attempts. Please try again in 15 minutes." });
  requests.set(key, entry && entry.until > now ? { ...entry, count: entry.count + 1 } : { count: 1, until: now + 900000 });
  next();
});
adminRouter.post("/request-code", async (req, res) => {
 try {
  const parsed = emailSchema.safeParse(req.body.email);
  if (!parsed.success) return res.status(400).json({ success: false, error: "Enter a valid email address." });
  const user = await prisma.adminUser.findUnique({ where: { email: parsed.data } });
  if (user?.active && (!user.codeRequestedAt || Date.now() - user.codeRequestedAt.getTime() >= 60000)) {
    const code = randomInt(100000, 1000000).toString();
    const claimed = await prisma.adminUser.updateMany({ where: { id: user.id, OR: [{ codeRequestedAt: null }, { codeRequestedAt: { lt: new Date(Date.now() - 60000) } }] }, data: { codeHash: hashAdminToken(code), codeExpiresAt: new Date(Date.now() + 600000), codeAttempts: 0, codeRequestedAt: new Date() } });
    if (claimed.count) {
      const result = await sendAdminLoginCode(user.email, code);
      if (!result.sent) throw new Error("Email unavailable");
    }
  }
  return res.json({ success: true, data: { message: "If this email has admin access, a sign-in code has been sent. It expires in 10 minutes." } });
 } catch { return res.status(503).json({ success: false, error: "The sign-in email could not be sent. Please try again later." }); }
});
adminRouter.post("/verify-code", async (req, res) => {
 try {
  const parsed = z.object({ email: emailSchema, code: z.string().regex(/^\d{6}$/) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, error: "Enter your email and six-digit code." });
  const user = await prisma.adminUser.findUnique({ where: { email: parsed.data.email } });
  if (!user?.active || !user.codeExpiresAt || user.codeExpiresAt.getTime() <= Date.now() || user.codeAttempts >= 5) return res.status(401).json({ success: false, error: "Invalid or expired code. Request a new code." });
  if (user.codeHash !== hashAdminToken(parsed.data.code)) {
    await prisma.adminUser.updateMany({ where: { id: user.id, codeHash: user.codeHash }, data: { codeAttempts: { increment: 1 } } });
    return res.status(401).json({ success: false, error: "Invalid or expired code." });
  }
  const token = randomBytes(32).toString("hex");
  const accepted = await prisma.$transaction(async (tx) => {
    const used = await tx.adminUser.updateMany({ where: { id: user.id, codeHash: user.codeHash, active: true, codeAttempts: { lt: 5 }, codeExpiresAt: { gt: new Date() } }, data: { codeHash: null, codeExpiresAt: null } });
    if (!used.count) return false;
    await tx.adminSession.create({ data: { userId: user.id, tokenHash: hashAdminToken(token), expiresAt: new Date(Date.now() + 8 * 3600000) } });
    return true;
  });
  if (!accepted) return res.status(401).json({ success: false, error: "Code already used. Request a new code." });
  return res.json({ success: true, data: { token, email: user.email } });
 } catch { return res.status(503).json({ success: false, error: "Sign-in is temporarily unavailable." }); }
});
adminRouter.post("/logout", async (req, res) => {
 try {
  const token = req.header("authorization")?.replace(/^Bearer /, "");
  if (token) await prisma.adminSession.deleteMany({ where: { tokenHash: hashAdminToken(token) } });
  res.json({ success: true });
 } catch { res.status(503).json({ success: false, error: "Sign-out is temporarily unavailable." }); }
});
