import type { CapsuleOrder, ContactMessage, EspressoInquiry, Product } from "../types.js";

export const products: Product[] = [
  {
    id: "capsules-classic",
    name: "Capsules Classic",
    category: "capsules",
    description: "Balanced and smooth cup with soft crema.",
    priceEur: 6.4,
    inStock: true,
  },
  {
    id: "capsules-aroma",
    name: "Capsules Aroma",
    category: "capsules",
    description: "Richer fragrance with elegant aftertaste.",
    priceEur: 6.9,
    inStock: true,
  },
  {
    id: "capsules-black",
    name: "Capsules Black",
    category: "capsules",
    description: "Strong body with deeper roast character.",
    priceEur: 7.2,
    inStock: true,
  },
  {
    id: "espresso-classic",
    name: "Galla Classic",
    category: "espresso",
    description: "Arabica and Robusta blend with smooth crema.",
    priceEur: null,
    inStock: true,
  },
  {
    id: "espresso-aroma",
    name: "Galla Aroma",
    category: "espresso",
    description: "Well-defined blend with rich aromatic profile.",
    priceEur: null,
    inStock: true,
  },
  {
    id: "espresso-cream",
    name: "Galla Cream",
    category: "espresso",
    description: "Middle-roast blend with creamy texture.",
    priceEur: null,
    inStock: true,
  },
  {
    id: "espresso-black",
    name: "Galla Black",
    category: "espresso",
    description: "Full-bodied premium blend with balanced acidity.",
    priceEur: null,
    inStock: true,
  },
];

export const contactMessages: ContactMessage[] = [];
export const capsuleOrders: CapsuleOrder[] = [];
export const espressoInquiries: EspressoInquiry[] = [];
