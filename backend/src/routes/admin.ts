import { Router } from "express";
import { createHash, randomBytes, randomInt } from "node:crypto";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { sendAdminLoginCode } from "../services/email.js";
import { hashPassword, checkPassword } from "../lib/password.js";
export const adminRouter = Router();
export const hashAdminToken = (value: string) => createHash("sha256").update(value).digest("hex");
const emailSchema = z.string().trim().email().transform((value) => value.toLowerCase());
const passwordSchema = z.string().min(12).max(128);
const passwordAttempts = new Map<string, { count: number; until: number }>();
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
  const parsed = z.object({ email: emailSchema, code: z.string().regex(/^\d{6}$/), password: passwordSchema }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, error: "Enter your email, six-digit code, and a password of 12–128 characters." });
  const user = await prisma.adminUser.findUnique({ where: { email: parsed.data.email } });
  if (!user?.active || !user.codeExpiresAt || user.codeExpiresAt.getTime() <= Date.now() || user.codeAttempts >= 5) return res.status(401).json({ success: false, error: "Invalid or expired code. Request a new code." });
  if (user.codeHash !== hashAdminToken(parsed.data.code)) {
    await prisma.adminUser.updateMany({ where: { id: user.id, codeHash: user.codeHash }, data: { codeAttempts: { increment: 1 } } });
    return res.status(401).json({ success: false, error: "Invalid or expired code." });
  }
  const passwordHash = await hashPassword(parsed.data.password);
  const token = randomBytes(32).toString("hex");
  const accepted = await prisma.$transaction(async (tx) => {
    const used = await tx.adminUser.updateMany({ where: { id: user.id, codeHash: user.codeHash, active: true, codeAttempts: { lt: 5 }, codeExpiresAt: { gt: new Date() } }, data: { codeHash: null, codeExpiresAt: null, passwordHash } });
    if (!used.count) return false;
    await tx.adminSession.deleteMany({ where: { userId: user.id } });
    await tx.adminSession.create({ data: { userId: user.id, tokenHash: hashAdminToken(token), expiresAt: new Date(Date.now() + 8 * 3600000) } });
    return true;
  });
  if (!accepted) return res.status(401).json({ success: false, error: "Code already used. Request a new code." });
  passwordAttempts.delete(user.email);
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

async function profileUser(token: string | undefined) {
  if (!token) return null;
  const session = await prisma.adminSession.findUnique({ where: { tokenHash: hashAdminToken(token) }, include: { user: true } });
  return session && session.expiresAt > new Date() && session.user.active ? session.user : null;
}
adminRouter.get("/profile", async (req, res) => {
 try {
  const user = await profileUser(req.header("authorization")?.replace(/^Bearer /, ""));
  if (!user) return res.status(401).json({ success: false, error: "Please sign in." });
  return res.json({ success: true, data: { name: user.name, email: user.email, role: "Admin" } });
 } catch { return res.status(503).json({ success: false, error: "Could not load profile." }); }
});
adminRouter.patch("/profile", async (req, res) => {
 try {
  const user = await profileUser(req.header("authorization")?.replace(/^Bearer /, ""));
  if (!user) return res.status(401).json({ success: false, error: "Please sign in." });
  const parsed = z.object({ name: z.string().trim().min(2).max(80) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, error: "Name must be between 2 and 80 characters." });
  const updated = await prisma.adminUser.update({ where: { id: user.id }, data: { name: parsed.data.name } });
  return res.json({ success: true, data: { name: updated.name, email: updated.email, role: "Admin" } });
 } catch { return res.status(503).json({ success: false, error: "Could not save profile." }); }
});

adminRouter.post("/login", async (req, res) => {
 try {
  const parsed = z.object({ email: emailSchema, password: z.string().min(1).max(128) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, error: "Enter your email and password." });
  const now = Date.now();
  for (const [email, entry] of passwordAttempts) if (entry.until <= now) passwordAttempts.delete(email);
  const attempt = passwordAttempts.get(parsed.data.email);
  if (attempt && attempt.count >= 5) return res.status(429).json({ success: false, error: "Too many login attempts. Please wait 15 minutes or reset your password." });
  passwordAttempts.set(parsed.data.email, { count: (attempt?.count || 0) + 1, until: attempt?.until || now + 900000 });
  const user = await prisma.adminUser.findUnique({ where: { email: parsed.data.email } });
  const valid = await checkPassword(parsed.data.password, user?.passwordHash || "00000000000000000000000000000000:" + "00".repeat(64));
  if (!user?.active || !user.passwordHash || !valid) return res.status(401).json({ success: false, error: "Incorrect email or password. For first-time access, choose Set up or reset password." });
  passwordAttempts.delete(user.email);
  const token = randomBytes(32).toString("hex");
  await prisma.adminSession.create({ data: { userId: user.id, tokenHash: hashAdminToken(token), expiresAt: new Date(Date.now() + 8 * 3600000) } });
  return res.json({ success: true, data: { token, email: user.email } });
 } catch { return res.status(503).json({ success: false, error: "Sign-in is temporarily unavailable." }); }
});
