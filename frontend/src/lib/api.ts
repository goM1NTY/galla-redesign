const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://galla-redesign-production.up.railway.app";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  emailSent?: boolean;
}

async function request<T>(path: string, init: RequestInit): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    ...init,
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
  return request("/orders/capsules", {
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
