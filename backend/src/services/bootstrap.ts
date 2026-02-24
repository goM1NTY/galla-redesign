import { prisma } from "../lib/prisma.js";
import { PRODUCT_SEEDS } from "../data/productSeeds.js";

export async function ensureSeedProducts() {
  for (const product of PRODUCT_SEEDS) {
    await prisma.product.upsert({
      where: { code: product.code },
      update: {
        name: product.name,
        category: product.category,
        description: product.description,
        priceEur: product.priceEur,
        inStock: product.inStock,
      },
      create: {
        code: product.code,
        name: product.name,
        category: product.category,
        description: product.description,
        priceEur: product.priceEur,
        inStock: product.inStock,
      },
    });
  }
}
