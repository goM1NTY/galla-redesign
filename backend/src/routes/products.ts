import { Router } from "express";
import { prisma } from "../lib/prisma.js";

export const productsRouter = Router();

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
    })),
  });
});
