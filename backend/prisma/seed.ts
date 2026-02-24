import { PrismaClient } from "@prisma/client";
import { PRODUCT_SEEDS } from "../src/data/productSeeds.js";

const prisma = new PrismaClient();

async function main() {
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
      create: product,
    });
  }

  console.log(`Seeded ${PRODUCT_SEEDS.length} products`);
}

main()
  .catch((error) => {
    console.error("Seeding failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
