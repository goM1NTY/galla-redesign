const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://galla-redesign-production.up.railway.app";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  emailSent?: boolean;
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

export function getAdminOrders(adminKey: string) {
  return request<AdminOrder[]>("/orders/admin", {
    method: "GET",
    headers: { "x-admin-key": adminKey },
  });
}

export function updateAdminOrderStatus(adminKey: string, orderId: string, status: FulfillmentStatus) {
  return request<AdminOrder>(`/orders/admin/${orderId}/status`, {
    method: "PATCH",
    headers: { "x-admin-key": adminKey },
    body: JSON.stringify({ status }),
  });
}
