const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://galla-redesign-production.up.railway.app";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  emailSent?: boolean;
  confirmationEmailSent?: boolean;
}

interface CapsuleOrderResponse {
  orderNumber: string;
  customerEmail: string;
  totalCents: number;
  currency: string;
  eurToMkdRate: number;
}

export type FulfillmentStatus = "NEW" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export interface AdminOrder {
  id: string;
  orderNumber: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  deliveryAddress: string | null;
  city: string | null;
  postalCode: string | null;
  deliveryCountry: string;
  paymentMethod: "CASH_ON_DELIVERY" | "CARD";
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "CANCELLED";
  fulfillmentStatus: FulfillmentStatus;
  totalCents: number | null;
  currency: string;
  note: string | null;
  createdAt: string;
  items: Array<{
    id: string;
    quantity: number;
    unitPriceCents: number | null;
    lineTotalCents: number | null;
    product: { code: string; name: string };
  }>;
}

export interface AdminProduct {
  id: string;
  code: string;
  name: string;
  category: "capsules" | "espresso";
  priceEur: number | null;
  inStock: boolean;
  stockQuantity: number | null;
}

export interface StoreProduct {
  id: string;
  inStock: boolean;
  stockQuantity: number | null;
}

async function request<T>(path: string, init: RequestInit): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });

  const json = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !json.success) {
    throw new Error(json.error || "Request failed");
  }

  return json;
}

export function sendContact(payload: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  return request("/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function placeCapsuleOrder(payload: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  city: string;
  postalCode?: string;
  paymentMethod: "CASH_ON_DELIVERY";
  note?: string;
  items: Array<{ productId: string; quantity: number }>;
}) {
  return request<CapsuleOrderResponse>("/orders/capsules", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function sendEspressoInquiry(payload: {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  products: string[];
  message?: string;
}) {
  return request("/orders/espresso-inquiry", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getProducts() {
  return request<StoreProduct[]>("/products", { method: "GET" });
}

export function getAdminOrders(adminKey: string) {
  return request<AdminOrder[]>("/orders/admin", {
    method: "GET",
    headers: { Authorization: `Bearer ${adminKey}` },
  });
}

export function updateAdminOrderStatus(adminKey: string, orderId: string, status: FulfillmentStatus) {
  return request<AdminOrder>(`/orders/admin/${orderId}/status`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${adminKey}` },
    body: JSON.stringify({ status }),
  });
}

export function getAdminProducts(adminKey: string) {
  return request<AdminProduct[]>("/products/admin", {
    method: "GET",
    headers: { Authorization: `Bearer ${adminKey}` },
  });
}

export function updateAdminProductInventory(
  adminKey: string,
  productCode: string,
  stockQuantity: number | null,
  inStock: boolean,
) {
  return request<AdminProduct>(`/products/admin/${productCode}/inventory`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${adminKey}` },
    body: JSON.stringify({ stockQuantity, inStock }),
  });
}

export function requestAdminCode(email: string) {
  return request<{ message: string }>("/admin/request-code", { method: "POST", body: JSON.stringify({ email }) });
}
export function verifyAdminCode(email: string, code: string, password: string) {
  return request<{ token: string; email: string }>("/admin/verify-code", { method: "POST", body: JSON.stringify({ email, code, password }) });
}
export function logoutAdmin(token: string) {
  return request<never>("/admin/logout", { method: "POST", headers: { Authorization: `Bearer ${token}` } });
}

export interface AdminProfile { name: string; email: string; role: string; }
export function getAdminProfile(token: string) {
  return request<AdminProfile>("/admin/profile", { headers: { Authorization: `Bearer ${token}` } });
}
export function saveAdminProfile(token: string, name: string) {
  return request<AdminProfile>("/admin/profile", { method: "PATCH", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify({ name }) });
}

export function loginAdmin(email: string, password: string) {
  return request<{ token: string; email: string }>("/admin/login", { method: "POST", body: JSON.stringify({ email, password }) });
}
