export type ProductCategory = "capsules" | "espresso";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  priceEur: number | null;
  inStock: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  createdAt: string;
}

export interface CapsuleOrderItem {
  productId: string;
  quantity: number;
}

export interface CapsuleOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: CapsuleOrderItem[];
  note?: string;
  createdAt: string;
}

export interface EspressoInquiry {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  products: string[];
  message?: string;
  createdAt: string;
}
