import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AdminProfile,
  getAdminProfile,
  saveAdminProfile,
  loginAdmin,
  requestAdminCode,
  verifyAdminCode,
  logoutAdmin,
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
    inventoryHelp: "Count complete packs, not individual capsules. Choose whether to track the number of packs available.",
    quantity: "Packs in stock",
    tracked: "Tracked",
    untracked: "No quantity limit",
    available: "Available",
    unavailable: "Unavailable",
    save: "Save",
    inventoryError: "Could not update inventory",
    statuses: { NEW: "NEW", CONFIRMED: "CONFIRMED", SHIPPED: "SHIPPED", DELIVERED: "DELIVERED", CANCELLED: "CANCELLED" },
  },
  sq: {
    internal: "Administrimi i Galla-s",
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
    cash: "Pagesë me para në dorë gjatë dorëzimit",
    orderStatus: "Statusi i porosisë",
    noOrders: "Ende nuk ka porosi.",
    notRecorded: "Nuk është regjistruar",
    loadError: "Porositë nuk mund të ngarkoheshin",
    updateError: "Statusi nuk mund të ndryshohej",
    inventory: "Inventari",
    inventoryHelp: "Numëroni paketat e plota, jo kapsulat veç e veç. Zgjidhni nëse dëshironi të përcaktoni numrin e paketave në stok.",
    quantity: "Paketa në stok",
    tracked: "I gjurmuar",
    untracked: "Pa kufi sasie",
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
  const [adminKey, setAdminKey] = useState(() => window.sessionStorage.getItem("galla_admin_session") || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [setupPassword, setSetupPassword] = useState(false);
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [profileName, setProfileName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [stockDrafts, setStockDrafts] = useState<Record<string, string>>({});
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [updatingProductCode, setUpdatingProductCode] = useState<string | null>(null);

  const loadOrders = async (event?: FormEvent, token = adminKey) => {
    event?.preventDefault();
    setLoading(true);
    setError("");
    try {
      const [ordersResult, productsResult, profileResult] = await Promise.all([getAdminOrders(token), getAdminProducts(token), getAdminProfile(token)]);
      setProfile(profileResult.data || null);
      setProfileName(profileResult.data?.name || "");
      const loadedProducts = productsResult.data || [];
      setOrders(ordersResult.data || []);
      setProducts(loadedProducts);
      setStockDrafts(Object.fromEntries(loadedProducts.map((product) => [product.code, product.stockQuantity?.toString() || ""])));
      setAuthenticated(true);
      window.sessionStorage.setItem("galla_admin_session", token);
    } catch (requestError) {
      setAuthenticated(false);
      setError(requestError instanceof Error ? requestError.message : t.loadError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminKey) void loadOrders();
  }, []);

  const signIn = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!setupPassword) {
        const result = await loginAdmin(email, password);
        if (!result.data) throw new Error("Sign-in failed.");
        setAdminKey(result.data.token);
        await loadOrders(undefined, result.data.token);
        setPassword("");
      } else if (!codeSent) {
        const result = await requestAdminCode(email);
        setLoginMessage(result.data?.message || "Check your email for a sign-in code.");
        setCodeSent(true);
      } else {
        if (password !== confirmPassword) throw new Error(language === "sq" ? "Fjalëkalimet nuk përputhen." : "Passwords do not match.");
        const result = await verifyAdminCode(email, code, password);
        if (!result.data) throw new Error("Sign-in failed.");
        setAdminKey(result.data.token);
        await loadOrders(undefined, result.data.token);
        setCode("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Sign-in failed.");
    } finally { setLoading(false); }
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
    void logoutAdmin(adminKey).catch(() => undefined);
    setPassword("");
    setConfirmPassword("");
    setSetupPassword(false);
    setCodeSent(false);
    setCode("");
    setLoginMessage("");
    window.sessionStorage.removeItem("galla_admin_session");
    setAdminKey("");
    setProfile(null);
    setProfileName("");
    setProfileMessage("");
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
        <form onSubmit={signIn} className="w-full max-w-md rounded-xl border border-[#dfd4ca] bg-white p-7 shadow-lg">
          <div className="flex items-center justify-between gap-4"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9e0102]">{t.internal}</p>{languageButtons}</div>
          <h1 className="mt-2 font-serif text-3xl">{t.management}</h1>
          <p className="mt-2 text-sm text-[#62584f]">{language === "sq" ? "Hyni me emailin dhe fjalëkalimin tuaj." : "Sign in with your email and password. Set up your password once using an email code."}</p>
          <label className="mt-6 block text-sm font-semibold" htmlFor="admin-email">Email</label>
          <input id="admin-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required disabled={codeSent} className="mt-2 w-full rounded-md border border-[#d6c8bb] px-3 py-3 outline-none focus:border-[#9e0102]" />
          {codeSent && <>
            <label className="mt-4 block text-sm font-semibold" htmlFor="admin-code">{language === "sq" ? "Kodi i hyrjes" : "Sign-in code"}</label>
            <input id="admin-code" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" required className="mt-2 w-full rounded-md border border-[#d6c8bb] px-3 py-3 outline-none focus:border-[#9e0102]" />
            <p className="mt-3 text-sm text-[#62584f]" role="status">{loginMessage}</p>
          </>}
          {(!setupPassword || codeSent) && <>
            <label className="mt-4 block text-sm font-semibold" htmlFor="admin-password">{language === "sq" ? "Fjalëkalimi" : setupPassword ? "New password" : "Password"}</label>
            <input id="admin-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={setupPassword ? "new-password" : "current-password"} minLength={setupPassword ? 12 : 1} maxLength={128} required className="mt-2 w-full rounded-md border border-[#d6c8bb] px-3 py-3" />
            {setupPassword && <>
              <p className="mt-2 text-xs text-[#62584f]">{language === "sq" ? "Të paktën 12 karaktere." : "Use at least 12 characters."}</p>
              <label className="mt-4 block text-sm font-semibold" htmlFor="admin-confirm-password">{language === "sq" ? "Konfirmoni fjalëkalimin" : "Confirm password"}</label>
              <input id="admin-confirm-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" minLength={12} maxLength={128} required className="mt-2 w-full rounded-md border border-[#d6c8bb] px-3 py-3" />
            </>}
          </>}
          <button disabled={loading} className="mt-4 w-full rounded-md bg-[#9e0102] px-4 py-3 font-bold text-white disabled:opacity-60">
            {loading ? t.checking : !setupPassword ? t.openOrders : codeSent ? (language === "sq" ? "Ruaj fjalëkalimin dhe hyr" : "Save password and sign in") : language === "sq" ? "Dërgo kodin e hyrjes" : "Send sign-in code"}
          </button>
          {codeSent && <button type="button" className="mt-3 text-sm text-[#9e0102]" onClick={() => { setCodeSent(false); setCode(""); setError(""); }}>{language === "sq" ? "Ndryshoni emailin ose kërkoni kod të ri" : "Change email or request a new code"}</button>}
          <button type="button" className="mt-4 block text-sm font-medium text-[#9e0102]" onClick={() => { setSetupPassword(!setupPassword); setCodeSent(false); setCode(""); setPassword(""); setConfirmPassword(""); setError(""); setLoginMessage(""); }}>{setupPassword ? (language === "sq" ? "Kthehu te hyrja me fjalëkalim" : "Back to password sign-in") : (language === "sq" ? "Vendos ose rivendos fjalëkalimin" : "Set up or reset password")}</button>
          {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
          <Link to="/" className="mt-5 block text-center text-sm text-[#9e0102] hover:underline">{t.back}</Link>
        </form>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f4f1] text-[#1f1f1f]">
      <header className="bg-[#9e0102] text-white">
        <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-5 md:px-6">
          <div><p className="text-xs uppercase tracking-[0.18em] text-[#ffd7d1]">{t.internal}</p><h1 className="font-serif text-2xl">{t.orders}</h1></div>
          <div className="flex flex-wrap items-center justify-end gap-2"><a href="#my-profile" className="mr-2 flex items-center gap-2 rounded-md border border-white/30 px-3 py-2"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-[#9e0102]">{(profile?.name || profile?.email || "A").split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase()}</span><span className="text-left"><span className="block text-sm font-semibold">{profile?.name || profile?.email}</span><span className="block text-xs text-white/80">{language === "sq" ? "Administratori" : "Administrator"}</span></span></a>{languageButtons}<button onClick={() => loadOrders()} className="rounded-md border border-white/40 px-3 py-2 text-sm">{t.refresh}</button><button onClick={signOut} className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-[#9e0102]">{t.signOut}</button></div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">
        {error && <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <details id="my-profile" className="mb-6 scroll-mt-24 rounded-xl border border-[#dfd4ca] bg-white p-5">
          <summary className="cursor-pointer font-semibold">{language === "sq" ? "Profili im" : "My profile"}</summary>
          <form className="mt-4 max-w-md" onSubmit={async (event) => {
            event.preventDefault(); setSavingProfile(true); setProfileMessage("");
            try {
              const result = await saveAdminProfile(adminKey, profileName);
              if (result.data) setProfile(result.data);
              setProfileMessage(language === "sq" ? "Profili u ruajt." : "Profile saved.");
            } catch (requestError) { setProfileMessage(requestError instanceof Error ? requestError.message : "Could not save profile."); }
            finally { setSavingProfile(false); }
          }}>
            <label htmlFor="profile-name" className="block text-sm font-semibold">{language === "sq" ? "Emri" : "Name"}</label>
            <input id="profile-name" value={profileName} onChange={(event) => setProfileName(event.target.value)} minLength={2} maxLength={80} required autoComplete="name" className="mt-2 w-full rounded-md border border-[#d6c8bb] px-3 py-2" />
            <p className="mt-3 break-all text-sm text-[#62584f]">{profile?.email}</p>
            <p className="mt-2 text-sm text-[#62584f]">{language === "sq" ? "Qasje e plotë në porositë dhe inventarin e përbashkët." : "Full access to shared orders and inventory."}</p>
            <button disabled={savingProfile} className="mt-4 rounded-md bg-[#9e0102] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{savingProfile ? t.checking : t.save}</button>
            {profileMessage && <p role="status" className="mt-3 text-sm">{profileMessage}</p>}
          </form>
        </details>
        <section className="mb-8 rounded-xl border border-[#dfd4ca] bg-white p-5 shadow-sm">
          <h2 className="font-serif text-2xl">{t.inventory}</h2>
          <p className="mt-1 text-sm text-[#62584f]">{t.inventoryHelp}</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {products.filter((product) => product.category === "capsules").map((product) => (
              <article key={product.code} className="rounded-lg border border-[#e3d9d0] p-4">
                <p className="font-semibold">{product.name}</p>
                <p className="mt-1 text-sm text-[#62584f]">{language === "sq" ? "1 paketë" : "1 pack"} = {product.code.includes("50") ? 50 : 10} {language === "sq" ? "kapsula" : "capsules"}</p>
                <label className="mt-3 block text-xs font-semibold" htmlFor={`stock-mode-${product.code}`}>{language === "sq" ? "Menaxhimi i stokut" : "Stock management"}</label>
                <select id={`stock-mode-${product.code}`} value={stockDrafts[product.code]?.trim() ? "counted" : "unlimited"} onChange={(event) => setStockDrafts((current) => ({ ...current, [product.code]: event.target.value === "counted" ? "0" : "" }))} className="mt-1 w-full rounded-md border border-[#d6c8bb] bg-white px-3 py-2 text-sm">
                  <option value="unlimited">{t.untracked}</option>
                  <option value="counted">{language === "sq" ? "Përcaktoni numrin e paketave" : "Set number of packs"}</option>
                </select>
                <label className="mt-3 block text-xs font-bold uppercase tracking-[0.08em]" htmlFor={`stock-${product.code}`}>{t.quantity}</label>
                <input
                  id={`stock-${product.code}`}
                  type="number"
                  min="0"
                  step="1"
                  value={stockDrafts[product.code] || ""}
                  disabled={!stockDrafts[product.code]?.trim()}
                  placeholder={t.untracked}
                  onChange={(event) => setStockDrafts((current) => ({ ...current, [product.code]: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-[#d6c8bb] px-3 py-2"
                />
                {stockDrafts[product.code]?.trim() && <p className="mt-2 text-xs text-[#62584f]">{stockDrafts[product.code]} {language === "sq" ? "paketa" : "packs"} × {product.code.includes("50") ? 50 : 10} = {Number(stockDrafts[product.code]) * (product.code.includes("50") ? 50 : 10)} {language === "sq" ? "kapsula gjithsej" : "capsules in total"}</p>}
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
