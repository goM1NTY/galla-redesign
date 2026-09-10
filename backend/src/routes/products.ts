import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAdmin } from "../middleware/admin.js";

export const productsRouter = Router();

const inventorySchema = z.object({
  stockQuantity: z.number().int().min(0).nullable(),
  inStock: z.boolean(),
});

productsRouter.get("/admin", requireAdmin, async (_req, res) => {
  const products = await prisma.product.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] });
  return res.json({ success: true, data: products });
});

productsRouter.patch("/admin/:productCode/inventory", requireAdmin, async (req, res) => {
  const parsed = inventorySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: "Invalid inventory values" });
  }

  try {
    const product = await prisma.product.update({
      where: { code: req.params.productCode },
      data: {
        stockQuantity: parsed.data.stockQuantity,
        inStock: parsed.data.stockQuantity === 0 ? false : parsed.data.inStock,
      },
    });
    return res.json({ success: true, data: product });
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "P2025") {
      return res.status(404).json({ success: false, error: "Product not found" });
    }
    throw error;
  }
});

productsRouter.get("/", async (_req, res) => {
  const products = await prisma.product.findMany({
    orderBy: [
      { category: "asc" },
      { name: "asc" },
    ],
  });

  res.json({
    success: true,
    data: products.map((product) => ({
      id: product.code,
      name: product.name,
      category: product.category,
      description: product.description,
      priceEur: product.priceEur,
      inStock: product.inStock,
      stockQuantity: product.stockQuantity,
    })),
  });
});
