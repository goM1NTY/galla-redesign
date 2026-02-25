import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CompactHeader from "@/components/CompactHeader";
import capsuleClassic10 from "@/assets/classicnew-white.png";
import capsuleClassic50 from "@/assets/50x.jpeg";
import capsuleAroma from "@/assets/aromanewnew-white.png";
import classicCoffee from "@/assets/classic-coffee.png";
import aromaCoffee from "@/assets/aroma-coffee.png";
import creamCoffee from "@/assets/cream-coffee.png";
import blackCoffee from "@/assets/black-coffee.png";
import { placeCapsuleOrder, sendEspressoInquiry } from "@/lib/api";

type Language = "en" | "sq" | "mk";
const LANGUAGE_STORAGE_KEY = "galla_lang";

const capsuleProducts = [
  {
    id: "capsules-classic",
    name: "Capsules Classic",
    subtitle: "Standard Pack",
    image: capsuleClassic10,
    description:
      "The quintessential Galla experience. A harmonious blend with a velvety crema and a smooth, lingering finish.",
    price: 6.4,
    netWeight: "10 capsules x 5 g (50 g)",
    roast: "Medium",
    intensity: "7/10",
    format: "Box of 10 capsules",
    compatibility: "Nespresso Original compatible",
    imageClassName: "",
  },
  {
    id: "capsules-classic-50x",
    name: "Capsules Classic",
    subtitle: "Value Pack",
    image: capsuleClassic50,
    description:
      "The same signature Classic profile in a larger box for high-volume use and longer stock at home or office.",
    price: 28.9,
    netWeight: "50 capsules x 5.5 g (275 g)",
    roast: "Medium",
    intensity: "7/10",
    format: "Box of 50 capsules",
    compatibility: "Nespresso Original compatible",
    imageClassName: "mix-blend-multiply translate-y-5",
  },
  {
    id: "capsules-aroma",
    name: "Capsules Aroma",
    image: capsuleAroma,
    description:
      "An olfactory journey. This medium-dark roast reveals deep floral notes and a sophisticated, cocoa-toned aftertaste.",
    price: 6.9,
    netWeight: "10 capsules x 5 g (50 g)",
    roast: "Medium-Dark",
    intensity: "8/10",
    format: "Box of 10 capsules",
    compatibility: "Nespresso Original compatible",
    imageClassName: "",
  },
];

const espressoProducts = [
  {
    id: "espresso-classic",
    name: "Galla Classic",
    image: classicCoffee,
    description:
      "This unique mixture combines high quality Arabica beans with selected Robusta beans from South America for a smooth crema and strong espresso character.",
  },
  {
    id: "espresso-aroma",
    name: "Galla Aroma",
    image: aromaCoffee,
    description:
      "Well defined mixture of high quality Arabica and Asiatic Robusta, carefully controlled and medium roasted for rich aroma and balance.",
  },
  {
    id: "espresso-cream",
    name: "Galla Cream",
    image: creamCoffee,
    description:
      "Balanced middle-roast blend with creamy texture and clean finish, crafted for consistent daily espresso enjoyment.",
  },
  {
    id: "espresso-black",
    name: "Galla Black",
    image: blackCoffee,
    description:
      "Premium espresso blend with deep character, full body, and balanced acidity for customers who prefer stronger flavor notes.",
  },
];

const CART_STORAGE_KEY = "galla_capsules_cart";
const INITIAL_CAPSULE_QTY = Object.fromEntries(capsuleProducts.map((product) => [product.id, 0])) as Record<string, number>;
const capsuleTranslations = {
  en: {
    home: "Home",
    capsules: "Capsules",
    newProductLine: "New Product Line",
    title: "The Art of Espresso, Encapsulated",
    intro: "Discover the exquisite Galla collection.",
    capsClassic: "Capsules Classic",
    capsAroma: "Capsules Aroma",
    standardPack: "Standard Pack",
    valuePack: "Value Pack",
    weight: "Weight",
    roast: "Roast",
    intensity: "Intensity",
    format: "Format",
    compatibility: "Compatibility",
    inStock: "In stock",
    dispatch24: "Dispatch in 24h",
    vatIncluded: "VAT included",
    orderSummary: "Order Summary",
    packsSelected: "Packs selected",
    emptyCart: "Empty Cart",
    yourName: "Your name",
    yourEmail: "Your email",
    phoneOptional: "Phone (optional)",
    orderNoteOptional: "Order note (optional)",
    noProducts: "No products selected yet.",
    subtotal: "Subtotal",
    shipping: "Shipping",
    total: "Total",
    free: "Free",
    submitting: "Submitting...",
    placeOrder: "Place Order",
    orderSuccess: "Order request sent successfully.",
    orderFailed: "Failed to send order.",
    freeShippingNote: "Free shipping above EUR 35. Orders are prepared within 24 hours.",
    ordersSubmittedApi: "Orders are submitted directly to the backend API.",
    espressoProducts: "Espresso Products",
    alsoAvailable: "Also Available To Order",
    espressoIntro:
      "Classic, Aroma, Cream, and Black espresso are also available for purchase. Prices are not displayed yet. Contact us for order details.",
    availableForOrder: "Available For Order",
    requestOffer: "Request Offer",
    espressoInquiryForm: "Espresso Inquiry Form",
    messageOptional: "Message (optional)",
    sendInquiry: "Send Inquiry",
    inquirySuccess: "Inquiry sent successfully.",
    inquiryFailed: "Failed to send inquiry.",
  },
  sq: {
    home: "Ballina",
    capsules: "Kapsula",
    newProductLine: "Linja e Re e Produkteve",
    title: "Arti i Espressos, i Kapsuluar",
    intro: "Zbuloni koleksionin e shkëlqyer Galla.",
    capsClassic: "Kapsula Classic",
    capsAroma: "Kapsula Aroma",
    standardPack: "Paketa Standarde",
    valuePack: "Paketa Value",
    weight: "Pesha",
    roast: "Pjekja",
    intensity: "Intensiteti",
    format: "Formati",
    compatibility: "Përputhshmëria",
    inStock: "Në stok",
    dispatch24: "Dërgesa brenda 24h",
    vatIncluded: "TVSH e përfshirë",
    orderSummary: "Përmbledhja e Porosisë",
    packsSelected: "Paketa të zgjedhura",
    emptyCart: "Zbraz Shportën",
    yourName: "Emri juaj",
    yourEmail: "Email-i juaj",
    phoneOptional: "Telefoni (opsional)",
    orderNoteOptional: "Shënim porosie (opsional)",
    noProducts: "Ende nuk ka produkte të zgjedhura.",
    subtotal: "Nëntotali",
    shipping: "Transporti",
    total: "Totali",
    free: "Falas",
    submitting: "Duke dërguar...",
    placeOrder: "Bëj Porosinë",
    orderSuccess: "Kërkesa e porosisë u dërgua me sukses.",
    orderFailed: "Dërgimi i porosisë dështoi.",
    freeShippingNote: "Transport falas mbi EUR 35. Porositë përgatiten brenda 24 orëve.",
    ordersSubmittedApi: "Porositë dërgohen direkt në backend API.",
    espressoProducts: "Produktet Espresso",
    alsoAvailable: "Gjithashtu në dispozicion për porosi",
    espressoIntro:
      "Classic, Aroma, Cream dhe Black espresso janë gjithashtu në dispozicion për porosi. Çmimet nuk shfaqen ende. Na kontaktoni për detajet e porosisë.",
    availableForOrder: "Në dispozicion për porosi",
    requestOffer: "Kërko Ofertë",
    espressoInquiryForm: "Formulari i Kërkesës Espresso",
    messageOptional: "Mesazh (opsional)",
    sendInquiry: "Dërgo Kërkesën",
    inquirySuccess: "Kërkesa u dërgua me sukses.",
    inquiryFailed: "Dërgimi i kërkesës dështoi.",
  },
  mk: {
    home: "Почетна",
    capsules: "Капсули",
    newProductLine: "Нова Линија",
    title: "Уметноста на Еспресото, Капсулирана",
    intro: "Откриј ја извонредната Galla колекција.",
    capsClassic: "Капсули Classic",
    capsAroma: "Капсули Aroma",
    standardPack: "Стандард Пакет",
    valuePack: "Value Пакет",
    weight: "Тежина",
    roast: "Печење",
    intensity: "Интензитет",
    format: "Формат",
    compatibility: "Компатибилност",
    inStock: "На залиха",
    dispatch24: "Испорака за 24ч",
    vatIncluded: "ДДВ вклучен",
    orderSummary: "Резиме на Нарачка",
    packsSelected: "Избрани пакувања",
    emptyCart: "Испразни Кошничка",
    yourName: "Ваше име",
    yourEmail: "Ваш email",
    phoneOptional: "Телефон (опционално)",
    orderNoteOptional: "Белешка за нарачка (опционално)",
    noProducts: "Сè уште нема избрани производи.",
    subtotal: "Меѓузбир",
    shipping: "Достава",
    total: "Вкупно",
    free: "Бесплатно",
    submitting: "Се испраќа...",
    placeOrder: "Нарачај",
    orderSuccess: "Барањето за нарачка е успешно испратено.",
    orderFailed: "Неуспешно испраќање на нарачка.",
    freeShippingNote: "Бесплатна достава над EUR 35. Нарачките се подготвуваат за 24 часа.",
    ordersSubmittedApi: "Нарачките се испраќаат директно до backend API.",
    espressoProducts: "Еспресо Производи",
    alsoAvailable: "Исто така достапно за нарачка",
    espressoIntro:
      "Classic, Aroma, Cream и Black еспресо се исто така достапни за нарачка. Цените не се прикажани сè уште. Контактирајте нè за детали.",
    availableForOrder: "Достапно за нарачка",
    requestOffer: "Побарај Понуда",
    espressoInquiryForm: "Формулар за Espresso",
    messageOptional: "Порака (опционално)",
    sendInquiry: "Испрати Барање",
    inquirySuccess: "Барањето е успешно испратено.",
    inquiryFailed: "Неуспешно испраќање на барањето.",
  },
} as const;

const Capsules = () => {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window === "undefined") return "en";
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return saved === "sq" || saved === "mk" ? saved : "en";
  });
  const t = capsuleTranslations[lang];
  const [capsuleClassic50Transparent, setCapsuleClassic50Transparent] = useState(capsuleClassic50);

  const [capsuleQty, setCapsuleQty] = useState<Record<string, number>>(() => {
    if (typeof window === "undefined") {
      return { ...INITIAL_CAPSULE_QTY };
    }

    const saved = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!saved) {
      return { ...INITIAL_CAPSULE_QTY };
    }

    try {
      const parsed = JSON.parse(saved) as Record<string, number>;
      return Object.fromEntries(
        capsuleProducts.map((product) => [product.id, Math.max(0, Number(parsed[product.id]) || 0)]),
      ) as Record<string, number>;
    } catch {
      return { ...INITIAL_CAPSULE_QTY };
    }
  });

  const selectedCapsules = useMemo(
    () => capsuleProducts.filter((product) => capsuleQty[product.id] > 0),
    [capsuleQty],
  );

  const totalCapsulePacks = selectedCapsules.reduce((sum, product) => sum + capsuleQty[product.id], 0);
  const capsuleTotal = selectedCapsules.reduce((sum, product) => sum + product.price * capsuleQty[product.id], 0);
  const shippingFee = totalCapsulePacks === 0 ? 0 : capsuleTotal >= 35 ? 0 : 3.9;
  const finalTotal = capsuleTotal + shippingFee;
  const hasCapsuleSelection = totalCapsulePacks > 0;
  const [orderForm, setOrderForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    note: "",
  });
  const [orderSubmitState, setOrderSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [orderSubmitMessage, setOrderSubmitMessage] = useState("");
  const [espressoForm, setEspressoForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    message: "",
    products: [] as string[],
  });
  const [espressoSubmitState, setEspressoSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [espressoSubmitMessage, setEspressoSubmitMessage] = useState("");

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(capsuleQty));
  }, [capsuleQty]);

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  }, [lang]);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = capsuleClassic50;

    img.onload = () => {
      const width = img.width;
      const height = img.height;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height);
      const { data } = imageData;

      const corners = [
        0,
        (width - 1) * 4,
        ((height - 1) * width) * 4,
        ((height - 1) * width + (width - 1)) * 4,
      ];

      const bg = corners.reduce(
        (acc, idx) => {
          acc.r += data[idx];
          acc.g += data[idx + 1];
          acc.b += data[idx + 2];
          return acc;
        },
        { r: 0, g: 0, b: 0 },
      );

      const bgR = bg.r / corners.length;
      const bgG = bg.g / corners.length;
      const bgB = bg.b / corners.length;
      const threshold = 70;

      const visited = new Uint8Array(width * height);
      const queue = new Uint32Array(width * height);
      let head = 0;
      let tail = 0;

      const enqueue = (x: number, y: number) => {
        const index = y * width + x;
        if (!visited[index]) {
          visited[index] = 1;
          queue[tail++] = index;
        }
      };

      const matchesBackground = (index: number) => {
        const i = index * 4;
        const dr = data[i] - bgR;
        const dg = data[i + 1] - bgG;
        const db = data[i + 2] - bgB;
        return Math.sqrt(dr * dr + dg * dg + db * db) < threshold;
      };

      for (let x = 0; x < width; x += 1) {
        enqueue(x, 0);
        enqueue(x, height - 1);
      }
      for (let y = 1; y < height - 1; y += 1) {
        enqueue(0, y);
        enqueue(width - 1, y);
      }

      while (head < tail) {
        const index = queue[head++];
        if (!matchesBackground(index)) continue;

        const i = index * 4;
        data[i + 3] = 0;

        const x = index % width;
        const y = Math.floor(index / width);
        if (x > 0) enqueue(x - 1, y);
        if (x < width - 1) enqueue(x + 1, y);
        if (y > 0) enqueue(x, y - 1);
        if (y < height - 1) enqueue(x, y + 1);
      }

      ctx.putImageData(imageData, 0, 0);
      setCapsuleClassic50Transparent(canvas.toDataURL("image/png"));
    };
  }, []);

  const increaseCapsule = (id: string) => {
    setCapsuleQty((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const decreaseCapsule = (id: string) => {
    setCapsuleQty((prev) => ({ ...prev, [id]: Math.max(0, prev[id] - 1) }));
  };

  const clearCart = () => {
    setCapsuleQty({ ...INITIAL_CAPSULE_QTY });
  };

  const handleCapsuleOrderSubmit = async () => {
    if (!hasCapsuleSelection) return;

    setOrderSubmitState("loading");
    setOrderSubmitMessage("");
    try {
      await placeCapsuleOrder({
        customerName: orderForm.customerName,
        customerEmail: orderForm.customerEmail,
        customerPhone: orderForm.customerPhone || undefined,
        note: orderForm.note || undefined,
        items: selectedCapsules.map((product) => ({
          productId: product.id,
          quantity: capsuleQty[product.id],
        })),
      });

      setOrderSubmitState("success");
      setOrderSubmitMessage(t.orderSuccess);
      setCapsuleQty({ ...INITIAL_CAPSULE_QTY });
      setOrderForm({ customerName: "", customerEmail: "", customerPhone: "", note: "" });
    } catch (error) {
      setOrderSubmitState("error");
      setOrderSubmitMessage(error instanceof Error ? error.message : t.orderFailed);
    }
  };

  const handleSelectEspressoProduct = (productId: string) => {
    setEspressoForm((prev) => ({
      ...prev,
      products: prev.products.includes(productId) ? prev.products : [...prev.products, productId],
    }));
    document.getElementById("espresso-inquiry-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleEspressoInquirySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEspressoSubmitState("loading");
    setEspressoSubmitMessage("");

    try {
      await sendEspressoInquiry({
        customerName: espressoForm.customerName,
        customerEmail: espressoForm.customerEmail,
        customerPhone: espressoForm.customerPhone || undefined,
        message: espressoForm.message || undefined,
        products: espressoForm.products,
      });
      setEspressoSubmitState("success");
      setEspressoSubmitMessage(t.inquirySuccess);
      setEspressoForm({ customerName: "", customerEmail: "", customerPhone: "", message: "", products: [] });
    } catch (error) {
      setEspressoSubmitState("error");
      setEspressoSubmitMessage(error instanceof Error ? error.message : t.inquiryFailed);
    }
  };

  return (
    <div className="min-h-screen bg-white font-['Helvetica_Neue','Roboto',sans-serif] text-[#1f1f1f]">
      <CompactHeader cartCount={totalCapsulePacks} cartHref="#order-summary" lang={lang} onLangChange={setLang} />
      <div className="pb-14 pt-20 md:pb-20 md:pt-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.1em] text-[#787878]">
            <Link to="/" className="transition-colors hover:text-[#9e0102]">
              {t.home}
            </Link>{" "}
            &gt; <span className="text-[#9e0102]">{t.capsules}</span>
          </p>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9e0102]">{t.newProductLine}</p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight md:text-5xl">{t.title}</h1>
          <p className="mt-4 text-base leading-8 text-[#3a3a3a] md:text-lg">
            {t.intro}
          </p>
        </div>

        <div className={`mt-12 grid grid-cols-1 gap-10 ${hasCapsuleSelection ? "lg:grid-cols-[minmax(0,7fr)_minmax(320px,3fr)]" : ""}`}>
          <div
            className="flex flex-col gap-8 md:flex-row md:flex-wrap md:items-stretch"
          >
            {capsuleProducts.map((product) => (
              <article
                key={product.id}
                className={`flex w-full flex-col rounded-[12px] border border-[#ece6df] bg-white p-5 shadow-[0_12px_30px_-18px_rgba(0,0,0,0.35)] ${
                  hasCapsuleSelection ? "md:basis-[calc(50%-1rem)]" : "md:basis-[calc(50%-1rem)] xl:basis-[calc(33.333%-1.34rem)]"
                }`}
              >
                <div className="relative flex h-[250px] items-center justify-center p-3">
                  {product.id === "capsules-classic-50x" && (
                    <span className="absolute right-3 top-3 z-10 rounded-md bg-[#9e0102] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow-md animate-pulse">
                      50X
                    </span>
                  )}
                  <img
                    src={product.id === "capsules-classic-50x" ? capsuleClassic50Transparent : product.image}
                    alt={product.name}
                    className={`mx-auto h-[220px] w-auto object-contain ${product.imageClassName ?? ""}`}
                  />
                </div>

                <div className="mt-4 flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-2xl font-medium leading-tight tracking-tight">
                        {product.id.startsWith("capsules-classic") ? t.capsClassic : t.capsAroma}
                      </h2>
                      {product.subtitle && (
                        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#6d6d6d]">
                          {product.id === "capsules-classic-50x" ? t.valuePack : t.standardPack}
                        </p>
                      )}
                    </div>
                    <p className="text-lg font-bold text-[#9e0102]">EUR {product.price.toFixed(2)}</p>
                  </div>
                  <p className="mt-2 min-h-[96px] text-sm leading-7 text-[#4f4f4f]">{product.description}</p>

                  <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-[#3b3b3b] md:text-sm">
                    <p><span className="font-semibold">{t.weight}:</span> {product.netWeight}</p>
                    <p><span className="font-semibold">{t.roast}:</span> {product.roast}</p>
                    <p><span className="font-semibold">{t.intensity}:</span> {product.intensity}</p>
                    <p><span className="font-semibold">{t.format}:</span> {product.format}</p>
                    <p className="col-span-2"><span className="font-semibold">{t.compatibility}:</span> {product.compatibility}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs">
                    <p className="font-semibold text-green-700">{t.inStock}</p>
                    <p className="text-[#5a5a5a]">{t.dispatch24}</p>
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-[#e6ddd4] pt-4">
                    <div className="inline-flex items-center rounded-md border border-[#cab8a6]">
                      <button
                        type="button"
                        onClick={() => decreaseCapsule(product.id)}
                        className="h-9 w-9 text-lg leading-none transition-colors hover:bg-[#f4ece4]"
                      >
                        -
                      </button>
                      <span className="w-10 text-center text-sm font-semibold">{capsuleQty[product.id]}</span>
                      <button
                        type="button"
                        onClick={() => increaseCapsule(product.id)}
                        className="h-9 w-9 text-lg leading-none transition-colors hover:bg-[#f4ece4]"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-xs text-[#5d554e]">{t.vatIncluded}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {hasCapsuleSelection && (
          <aside id="order-summary" className="h-fit rounded-[12px] border border-[#e8e1d8] bg-white p-6 shadow-[0_12px_30px_-18px_rgba(0,0,0,0.35)] lg:sticky lg:top-24">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9e0102]">{t.orderSummary}</p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="text-sm text-[#4a4a4a]">
                {t.packsSelected}: <span className="font-semibold text-[#1f1f1f]">{totalCapsulePacks}</span>
              </p>
              <button
                type="button"
                onClick={clearCart}
                className="rounded-md border border-[#d6c8bb] px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#7a6a5e] transition-colors hover:bg-[#f8f3ee]"
              >
                {t.emptyCart}
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <input
                type="text"
                value={orderForm.customerName}
                onChange={(event) => setOrderForm((prev) => ({ ...prev, customerName: event.target.value }))}
                placeholder={t.yourName}
                className="w-full rounded-[6px] border border-[#E0E0E0] px-3 py-3 text-sm outline-none focus:border-[#9e0102]"
              />
              <input
                type="email"
                value={orderForm.customerEmail}
                onChange={(event) => setOrderForm((prev) => ({ ...prev, customerEmail: event.target.value }))}
                placeholder={t.yourEmail}
                className="w-full rounded-[6px] border border-[#E0E0E0] px-3 py-3 text-sm outline-none focus:border-[#9e0102]"
              />
              <input
                type="text"
                value={orderForm.customerPhone}
                onChange={(event) => setOrderForm((prev) => ({ ...prev, customerPhone: event.target.value }))}
                placeholder={t.phoneOptional}
                className="w-full rounded-[6px] border border-[#E0E0E0] px-3 py-3 text-sm outline-none focus:border-[#9e0102]"
              />
              <textarea
                value={orderForm.note}
                onChange={(event) => setOrderForm((prev) => ({ ...prev, note: event.target.value }))}
                placeholder={t.orderNoteOptional}
                rows={3}
                className="w-full resize-y rounded-[6px] border border-[#E0E0E0] px-3 py-3 text-sm outline-none focus:border-[#9e0102]"
              />
            </div>

            <div className="mt-4 space-y-2 border-b border-[#e8ddd2] pb-4 text-sm text-[#383838]">
              {selectedCapsules.length === 0 ? (
                <p>{t.noProducts}</p>
              ) : (
                selectedCapsules.map((product) => (
                  <div key={product.id} className="flex items-center justify-between gap-2">
                    <p className="line-clamp-1">{product.name} x {capsuleQty[product.id]}</p>
                    <p className="font-medium">EUR {(capsuleQty[product.id] * product.price).toFixed(2)}</p>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between text-[#4b4b4b]">
                <p>{t.subtotal}</p>
                <p>EUR {capsuleTotal.toFixed(2)}</p>
              </div>
              <div className="flex items-center justify-between text-[#4b4b4b]">
                <p>{t.shipping}</p>
                <p>{shippingFee === 0 ? t.free : `EUR ${shippingFee.toFixed(2)}`}</p>
              </div>
              <div className="flex items-center justify-between border-t border-[#e8ddd2] pt-3 text-base font-bold text-[#1f1f1f]">
                <p>{t.total}</p>
                <p>EUR {finalTotal.toFixed(2)}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCapsuleOrderSubmit}
              disabled={
                orderSubmitState === "loading" || !orderForm.customerName || !orderForm.customerEmail || !hasCapsuleSelection
              }
              className="mt-5 inline-flex w-full items-center justify-center rounded-[6px] bg-[#8B1A1A] px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition-colors duration-200 hover:bg-[#741313]"
            >
              {orderSubmitState === "loading" ? t.submitting : t.placeOrder}
            </button>
            {orderSubmitState !== "idle" && (
              <p className={`mt-2 text-xs ${orderSubmitState === "success" ? "text-green-700" : "text-red-700"}`}>
                {orderSubmitMessage}
              </p>
            )}

            <p className="mt-3 text-xs text-[#6d6259]">{t.freeShippingNote}</p>
            <p className="mt-2 text-xs text-[#6d6259]">{t.ordersSubmittedApi}</p>
          </aside>
          )}
        </div>

        <div className="mt-16 border-t border-[#dbcfc4] pt-12">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9e0102]">{t.espressoProducts}</p>
          <h2 className="mt-2 text-3xl font-medium tracking-tight md:text-4xl">{t.alsoAvailable}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#4a4a4a] md:text-base">
            {t.espressoIntro}
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {espressoProducts.map((product) => (
              <article key={product.id} className="rounded-2xl border border-[#dbcfc4] bg-white p-6 shadow-md">
                <div className="rounded-xl bg-[#f7f3ee] p-4">
                  <img src={product.image} alt={product.name} className="mx-auto h-40 w-auto object-contain md:h-44" />
                </div>
                <h3 className="mt-4 text-2xl font-medium tracking-tight text-[#1f1f1f]">{product.name}</h3>
                <p className="mt-2 text-sm leading-7 text-[#4f4f4f]">{product.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#9e0102]">{t.availableForOrder}</p>
                  <button
                    type="button"
                    onClick={() => handleSelectEspressoProduct(product.id)}
                    className="inline-flex items-center rounded-md bg-[#9e0102] px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-white transition-opacity hover:opacity-90"
                  >
                    {t.requestOffer}
                  </button>
                </div>
              </article>
            ))}
          </div>

          <form
            id="espresso-inquiry-form"
            onSubmit={handleEspressoInquirySubmit}
            className="mt-8 rounded-2xl border border-[#dbcfc4] bg-white p-6 shadow-md"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.1em] text-[#9e0102]">{t.espressoInquiryForm}</p>
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
              {espressoProducts.map((product) => (
                <label key={product.id} className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={espressoForm.products.includes(product.id)}
                    onChange={(event) =>
                      setEspressoForm((prev) => ({
                        ...prev,
                        products: event.target.checked
                          ? [...prev.products, product.id]
                          : prev.products.filter((id) => id !== product.id),
                      }))
                    }
                  />
                  {product.name}
                </label>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
              <input
                type="text"
                required
                value={espressoForm.customerName}
                onChange={(event) => setEspressoForm((prev) => ({ ...prev, customerName: event.target.value }))}
                placeholder={t.yourName}
                className="w-full rounded-md border border-[#d6c8bb] px-3 py-2 text-sm outline-none focus:border-[#9e0102]"
              />
              <input
                type="email"
                required
                value={espressoForm.customerEmail}
                onChange={(event) => setEspressoForm((prev) => ({ ...prev, customerEmail: event.target.value }))}
                placeholder={t.yourEmail}
                className="w-full rounded-md border border-[#d6c8bb] px-3 py-2 text-sm outline-none focus:border-[#9e0102]"
              />
              <input
                type="text"
                value={espressoForm.customerPhone}
                onChange={(event) => setEspressoForm((prev) => ({ ...prev, customerPhone: event.target.value }))}
                placeholder={t.phoneOptional}
                className="w-full rounded-md border border-[#d6c8bb] px-3 py-2 text-sm outline-none focus:border-[#9e0102]"
              />
              <textarea
                value={espressoForm.message}
                onChange={(event) => setEspressoForm((prev) => ({ ...prev, message: event.target.value }))}
                placeholder={t.messageOptional}
                rows={3}
                className="w-full resize-y rounded-md border border-[#d6c8bb] px-3 py-2 text-sm outline-none focus:border-[#9e0102] md:col-span-2"
              />
            </div>

            <button
              type="submit"
              disabled={espressoSubmitState === "loading" || espressoForm.products.length === 0}
              className="mt-4 inline-flex items-center rounded-md bg-[#9e0102] px-5 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {espressoSubmitState === "loading" ? t.submitting : t.sendInquiry}
            </button>
            {espressoSubmitState !== "idle" && (
              <p className={`mt-2 text-sm ${espressoSubmitState === "success" ? "text-green-700" : "text-red-700"}`}>
                {espressoSubmitMessage}
              </p>
            )}
          </form>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Capsules;
