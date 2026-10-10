import { timingSafeEqual } from "node:crypto";
import type { RequestHandler } from "express";
import { prisma } from "../lib/prisma.js";
import { hashAdminToken } from "../routes/admin.js";
const ADMIN_API_KEY = process.env.ADMIN_API_KEY;
export const requireAdmin: RequestHandler = async (req, res, next) => {
  try {
    const token = req.header("authorization")?.replace(/^Bearer /, "");
    if (token) {
      const session = await prisma.adminSession.findUnique({ where: { tokenHash: hashAdminToken(token) }, include: { user: true } });
      if (session && session.expiresAt > new Date() && session.user.active) { next(); return; }
    }
    const supplied = Buffer.from(req.header("x-admin-key") || "");
    const expected = Buffer.from(ADMIN_API_KEY || "");
    if (expected.length && expected.length === supplied.length && timingSafeEqual(expected, supplied)) { next(); return; }
    return res.status(401).json({ success: false, error: "Please sign in to your admin account." });
  } catch { return res.status(503).json({ success: false, error: "Admin access is temporarily unavailable." }); }
};
