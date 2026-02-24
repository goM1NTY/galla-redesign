import { prisma } from "../lib/prisma.js";
import { PRODUCT_SEEDS } from "../data/productSeeds.js";

export async function ensureSeedProducts() {
  const count = await prisma.product.count();
  if (count > 0) return;

  await prisma.product.createMany({
    data: PRODUCT_SEEDS.map((product) => ({
      code: product.code,
      name: product.name,
      category: product.category,
      description: product.description,
      priceEur: product.priceEur,
      inStock: product.inStock,
    })),
  });
}
