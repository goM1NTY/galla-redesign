import { ProductCategory } from "@prisma/client";

const configuredRate = Number(process.env.EUR_TO_MKD_RATE || 61.5);
const eurToMkdRate = Number.isFinite(configuredRate) && configuredRate > 0 ? configuredRate : 61.5;

export const PRODUCT_SEEDS = [
  {
    code: "capsules-classic",
    name: "Capsules Classic",
    category: ProductCategory.capsules,
    description: "A smooth, balanced espresso with soft crema.",
    priceEur: 200 / eurToMkdRate,
    inStock: true,
  },
  {
    code: "capsules-classic-50x",
    name: "Capsules Classic 50x",
    category: ProductCategory.capsules,
    description: "Classic flavor profile in a larger 50-capsule box.",
    priceEur: 1000 / eurToMkdRate,
    inStock: true,
  },
  {
    code: "capsules-aroma",
    name: "Capsules Aroma",
    category: ProductCategory.capsules,
    description: "A rich aroma with a delicate aftertaste.",
    priceEur: 200 / eurToMkdRate,
    inStock: true,
  },
  {
    code: "capsules-black",
    name: "Capsules Black",
    category: ProductCategory.capsules,
    description: "Strong body with deeper roast character.",
    priceEur: 200 / eurToMkdRate,
    inStock: true,
  },
  {
    code: "espresso-classic",
    name: "Galla Classic",
    category: ProductCategory.espresso,
    description: "Arabica and Robusta blend with smooth crema.",
    priceEur: null,
    inStock: true,
  },
  {
    code: "espresso-aroma",
    name: "Galla Aroma",
    category: ProductCategory.espresso,
    description: "Well-defined blend with rich aromatic profile.",
    priceEur: null,
    inStock: true,
  },
  {
    code: "espresso-cream",
    name: "Galla Cream",
    category: ProductCategory.espresso,
    description: "Medium-roast blend with a creamy texture.",
    priceEur: null,
    inStock: true,
  },
  {
    code: "espresso-black",
    name: "Galla Black",
    category: ProductCategory.espresso,
    description: "Full-bodied premium blend with balanced acidity.",
    priceEur: null,
    inStock: true,
  },
] as const;
