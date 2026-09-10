import { timingSafeEqual } from "node:crypto";
import type { RequestHandler } from "express";

const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

export const requireAdmin: RequestHandler = (req, res, next) => {
  if (!ADMIN_API_KEY) {
    return res.status(503).json({ success: false, error: "Admin access is not configured" });
  }

  const suppliedKey = req.header("x-admin-key") || "";
  const expected = Buffer.from(ADMIN_API_KEY);
  const supplied = Buffer.from(suppliedKey);
  if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) {
    return res.status(401).json({ success: false, error: "Invalid admin access key" });
  }

  next();
};
