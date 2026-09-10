import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import {
  AdminOrder,
  AdminProduct,
  FulfillmentStatus,
  getAdminOrders,
  getAdminProducts,
  updateAdminOrderStatus,
  updateAdminProductInventory,
} from "@/lib/api";

const STATUSES: FulfillmentStatus[] = ["NEW", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
type AdminLanguage = "en" | "sq";

const adminTranslations = {
  en: {
    internal: "Galla internal",
    management: "Order Management",
    enterKey: "Enter the admin access key to continue.",
    adminKey: "Admin access key",
    checking: "Checking…",
    openOrders: "Open Orders",
    back: "Back to website",
    orders: "Orders",
    refresh: "Refresh",
    signOut: "Sign out",
    latest: "Latest",
    orderCount: "orders",
    noPhone: "No phone",
    note: "Note",
    cash: "Cash on delivery",
    orderStatus: "Order status",
    noOrders: "No orders yet.",
    notRecorded: "Not recorded",
    loadError: "Could not load orders",
    updateError: "Could not update order",
    inventory: "Inventory",
    inventoryHelp: "Leave quantity empty to keep stock untracked.",
    quantity: "Quantity",
    tracked: "Tracked",
    untracked: "Not tracked",
    available: "Available",
    unavailable: "Unavailable",
    save: "Save",
    inventoryError: "Could not update inventory",
    statuses: { NEW: "NEW", CONFIRMED: "CONFIRMED", SHIPPED: "SHIPPED", DELIVERED: "DELIVERED", CANCELLED: "CANCELLED" },
  },
  sq: {
    internal: "Galla administrim",
    management: "Menaxhimi i Porosive",
    enterKey: "Shkruani çelësin e administratorit për të vazhduar.",
    adminKey: "Çelësi i administratorit",
    checking: "Duke kontrolluar…",
    openOrders: "Hap Porositë",
    back: "Kthehu te faqja",
    orders: "Porositë",
    refresh: "Rifresko",
    signOut: "Dil",
    latest: "Porositë e fundit:",
    orderCount: "",
    noPhone: "Pa telefon",
    note: "Shënim",
    cash: "Pagesë me para në dorëzim",
    orderStatus: "Statusi i porosisë",
    noOrders: "Ende nuk ka porosi.",
    notRecorded: "Nuk është regjistruar",
    loadError: "Porositë nuk mund të ngarkoheshin",
    updateError: "Statusi nuk mund të ndryshohej",
    inventory: "Inventari",
    inventoryHelp: "Lëreni sasinë bosh për të mos e gjurmuar stokun.",
    quantity: "Sasia",
    tracked: "I gjurmuar",
    untracked: "Nuk gjurmohet",
    available: "Në dispozicion",
    unavailable: "Nuk është në dispozicion",
    save: "Ruaj",
    inventoryError: "Inventari nuk mund të ndryshohej",
    statuses: { NEW: "E RE", CONFIRMED: "E KONFIRMUAR", SHIPPED: "E DËRGUAR", DELIVERED: "E DORËZUAR", CANCELLED: "E ANULUAR" },
  },
};

const statusStyles: Record<FulfillmentStatus, { card: string; badge: string; select: string }> = {
  NEW: {
    card: "border-l-slate-300",
    badge: "border-slate-300 bg-white text-slate-700",
    select: "border-slate-300 bg-white text-slate-800",
  },
  CONFIRMED: {
    card: "border-l-amber-400",
    badge: "border-amber-300 bg-amber-100 text-amber-900",
    select: "border-amber-300 bg-amber-50 text-amber-900",
  },
  SHIPPED: {
    card: "border-l-lime-500",
    badge: "border-lime-400 bg-lime-100 text-lime-900",
    select: "border-lime-400 bg-lime-50 text-lime-900",
  },
  DELIVERED: {
    card: "border-l-green-600",
    badge: "border-green-500 bg-green-100 text-green-900",
    select: "border-green-500 bg-green-50 text-green-900",
  },
  CANCELLED: {
    card: "border-l-red-500",
    badge: "border-red-400 bg-red-100 text-red-900",
    select: "border-red-400 bg-red-50 text-red-900",
  },
};

const formatMoney = (order: AdminOrder, notRecorded: string) => {
  if (order.totalCents === null) return notRecorded;
  return `${Math.round(order.totalCents / 100).toLocaleString()} ${order.currency}`;
};

const AdminOrders = () => {
  const [language, setLanguage] = useState<AdminLanguage>(() =>
    window.localStorage.getItem("galla_admin_language") === "sq" ? "sq" : "en",
  );
  const t = adminTranslations[language];
  const [adminKey, setAdminKey] = useState(() => window.sessionStorage.getItem("galla_admin_key") || "");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [stockDrafts, setStockDrafts] = useState<Record<string, string>>({});
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [updatingProductCode, setUpdatingProductCode] = useState<string | null>(null);

  const loadOrders = async (event?: FormEvent) => {
    event?.preventDefault();
    setLoading(true);
    setError("");
    try {
      const [ordersResult, productsResult] = await Promise.all([getAdminOrders(adminKey), getAdminProducts(adminKey)]);
      const loadedProducts = productsResult.data || [];
      setOrders(ordersResult.data || []);
      setProducts(loadedProducts);
      setStockDrafts(Object.fromEntries(loadedProducts.map((product) => [product.code, product.stockQuantity?.toString() || ""])));
      setAuthenticated(true);
      window.sessionStorage.setItem("galla_admin_key", adminKey);
    } catch (requestError) {
      setAuthenticated(false);
      setError(requestError instanceof Error ? requestError.message : t.loadError);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, status: FulfillmentStatus) => {
    setUpdatingId(orderId);
    setError("");
    try {
      await updateAdminOrderStatus(adminKey, orderId, status);
      setOrders((current) => current.map((order) => (order.id === orderId ? { ...order, fulfillmentStatus: status } : order)));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : t.updateError);
    } finally {
      setUpdatingId(null);
    }
  };

  const signOut = () => {
    window.sessionStorage.removeItem("galla_admin_key");
    setAdminKey("");
    setOrders([]);
    setProducts([]);
    setAuthenticated(false);
  };

  const saveInventory = async (product: AdminProduct, nextInStock = product.inStock) => {
    const value = stockDrafts[product.code]?.trim() || "";
    const stockQuantity = value === "" ? null : Number(value);
    if (stockQuantity !== null && (!Number.isInteger(stockQuantity) || stockQuantity < 0)) {
      setError(t.inventoryError);
      return;
    }

    setUpdatingProductCode(product.code);
    setError("");
    try {
      const result = await updateAdminProductInventory(adminKey, product.code, stockQuantity, nextInStock);
      if (result.data) {
        setProducts((current) => current.map((item) => (item.code === product.code ? result.data! : item)));
        setStockDrafts((current) => ({ ...current, [product.code]: result.data!.stockQuantity?.toString() || "" }));
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : t.inventoryError);
    } finally {
      setUpdatingProductCode(null);
    }
  };

  const changeLanguage = (nextLanguage: AdminLanguage) => {
    setLanguage(nextLanguage);
    window.localStorage.setItem("galla_admin_language", nextLanguage);
  };

  const languageButtons = (
    <div className="flex gap-1" aria-label="Language">
      {(["en", "sq"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => changeLanguage(option)}
          className={`rounded px-2.5 py-1 text-xs font-bold ${language === option ? "bg-[#9e0102] text-white" : "border border-[#d6c8bb] bg-white text-[#6b5b4f]"}`}
        >
          {option === "en" ? "EN" : "AL"}
        </button>
      ))}
    </div>
  );

  if (!authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f4f1] px-4">
        <form onSubmit={loadOrders} className="w-full max-w-md rounded-xl border border-[#dfd4ca] bg-white p-7 shadow-lg">
          <div className="flex items-center justify-between gap-4"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9e0102]">{t.internal}</p>{languageButtons}</div>
          <h1 className="mt-2 font-serif text-3xl">{t.management}</h1>
          <p className="mt-2 text-sm text-[#62584f]">{t.enterKey}</p>
          <label className="mt-6 block text-sm font-semibold" htmlFor="admin-key">{t.adminKey}</label>
          <input
            id="admin-key"
            type="password"
            value={adminKey}
            onChange={(event) => setAdminKey(event.target.value)}
            autoComplete="current-password"
            required
            className="mt-2 w-full rounded-md border border-[#d6c8bb] px-3 py-3 outline-none focus:border-[#9e0102]"
          />
          <button disabled={loading} className="mt-4 w-full rounded-md bg-[#9e0102] px-4 py-3 font-bold text-white disabled:opacity-60">
            {loading ? t.checking : t.openOrders}
          </button>
          {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
          <Link to="/" className="mt-5 block text-center text-sm text-[#9e0102] hover:underline">{t.back}</Link>
        </form>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f4f1] text-[#1f1f1f]">
      <header className="bg-[#9e0102] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5">
          <div><p className="text-xs uppercase tracking-[0.18em] text-[#ffd7d1]">{t.internal}</p><h1 className="font-serif text-2xl">{t.orders}</h1></div>
          <div className="flex items-center gap-2">{languageButtons}<button onClick={() => loadOrders()} className="rounded-md border border-white/40 px-3 py-2 text-sm">{t.refresh}</button><button onClick={signOut} className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-[#9e0102]">{t.signOut}</button></div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">
        {error && <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <section className="mb-8 rounded-xl border border-[#dfd4ca] bg-white p-5 shadow-sm">
          <h2 className="font-serif text-2xl">{t.inventory}</h2>
          <p className="mt-1 text-sm text-[#62584f]">{t.inventoryHelp}</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {products.filter((product) => product.category === "capsules").map((product) => (
              <article key={product.code} className="rounded-lg border border-[#e3d9d0] p-4">
                <p className="font-semibold">{product.name}</p>
                <p className="text-xs text-[#62584f]">{product.code}</p>
                <label className="mt-3 block text-xs font-bold uppercase tracking-[0.08em]" htmlFor={`stock-${product.code}`}>{t.quantity}</label>
                <input
                  id={`stock-${product.code}`}
                  type="number"
                  min="0"
                  step="1"
                  value={stockDrafts[product.code] || ""}
                  placeholder={t.untracked}
                  onChange={(event) => setStockDrafts((current) => ({ ...current, [product.code]: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-[#d6c8bb] px-3 py-2"
                />
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    disabled={updatingProductCode === product.code}
                    onClick={() => saveInventory(product)}
                    className="flex-1 rounded-md bg-[#9e0102] px-3 py-2 text-xs font-bold text-white disabled:opacity-50"
                  >
                    {t.save}
                  </button>
                  <button
                    type="button"
                    disabled={updatingProductCode === product.code}
                    onClick={() => saveInventory(product, !product.inStock)}
                    className={`flex-1 rounded-md border px-3 py-2 text-xs font-bold ${product.inStock ? "border-green-400 bg-green-50 text-green-800" : "border-red-400 bg-red-50 text-red-800"}`}
                  >
                    {product.inStock ? t.available : t.unavailable}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
        <p className="mb-5 text-sm text-[#62584f]">{t.latest} {orders.length} {t.orderCount}</p>
        <div className="space-y-4">
          {orders.map((order) => (
            <article
              key={order.id}
              className={`rounded-xl border border-l-4 border-[#dfd4ca] bg-white p-5 shadow-sm ${statusStyles[order.fulfillmentStatus].card}`}
            >
              <div className="flex flex-col justify-between gap-4 lg:flex-row">
                <div>
                  <p className="font-mono text-sm font-bold text-[#9e0102]">{order.orderNumber || order.id}</p>
                  <p className="mt-1 font-semibold">{order.customerName} · {order.customerPhone || t.noPhone}</p>
                  <p className="text-sm text-[#5f564f]">{order.customerEmail}</p>
                  <p className="mt-2 text-sm">{order.deliveryAddress}, {order.city} {order.postalCode || ""}</p>
                  <p className="text-sm">{order.items.map((item) => `${item.product.name} × ${item.quantity}`).join(", ")}</p>
                  {order.note && <p className="mt-2 text-sm italic text-[#5f564f]">{t.note}: {order.note}</p>}
                </div>
                <div className="min-w-64">
                  <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold tracking-[0.08em] ${statusStyles[order.fulfillmentStatus].badge}`}>
                    {t.statuses[order.fulfillmentStatus]}
                  </span>
                  <p className="text-lg font-bold">{formatMoney(order, t.notRecorded)}</p>
                  <p className="text-xs text-[#62584f]">{t.cash} · {new Date(order.createdAt).toLocaleString(language === "sq" ? "sq-AL" : "en-GB")}</p>
                  <label className="mt-3 block text-xs font-bold uppercase tracking-[0.1em]" htmlFor={`status-${order.id}`}>{t.orderStatus}</label>
                  <select
                    id={`status-${order.id}`}
                    value={order.fulfillmentStatus}
                    disabled={updatingId === order.id}
                    onChange={(event) => updateStatus(order.id, event.target.value as FulfillmentStatus)}
                    className={`mt-1 w-full rounded-md border px-3 py-2 text-sm font-semibold ${statusStyles[order.fulfillmentStatus].select}`}
                  >
                    {STATUSES.map((status) => <option key={status} value={status}>{t.statuses[status]}</option>)}
                  </select>
                </div>
              </div>
            </article>
          ))}
          {!loading && orders.length === 0 && <p className="rounded-xl bg-white p-8 text-center text-[#62584f]">{t.noOrders}</p>}
        </div>
      </main>
    </div>
  );
};

export default AdminOrders;
