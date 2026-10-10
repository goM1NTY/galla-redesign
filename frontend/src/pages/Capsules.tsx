import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CompactHeader from "@/components/CompactHeader";
import StoreFooter from "@/components/StoreFooter";
import ProductImage from "@/components/ProductImage";
import capsuleClassic10 from "@/assets/capsules-classic-10-studio.webp";
import capsuleClassic50 from "@/assets/capsules-classic-50-studio.webp";
import capsuleAroma from "@/assets/capsules-aroma-10-studio.webp";
import classicCoffee from "@/assets/classic-coffee.webp";
import aromaCoffee from "@/assets/aroma-coffee.webp";
import creamCoffee from "@/assets/cream-coffee.webp";
import blackCoffee from "@/assets/black-coffee.webp";
import { getProducts, placeCapsuleOrder, sendEspressoInquiry } from "@/lib/api";

import { normalizeMacedonianPhone } from "@/lib/phone";

type Language = "en" | "sq" | "mk";
const LANGUAGE_STORAGE_KEY = "galla_lang";

const EUR_TO_MKD_RATE = Number(import.meta.env.VITE_EUR_TO_MKD_RATE || 61.5);

const capsuleProducts = [
  {
    id: "capsules-classic",
    name: "Capsules Classic",
    subtitle: "Standard Pack",
    image: capsuleClassic10,
    description:
      "A balanced espresso blend with smooth crema and a lingering finish.",
    price: 200 / EUR_TO_MKD_RATE,
    netWeight: "10 capsules x 5 g (50 g)",
    roast: "Medium",
    intensity: "7/10",
    format: "Box of 10 capsules",
    compatibility: "Compatible with Nespresso Original machines",
    imageClassName: "",
  },
  {
    id: "capsules-classic-50x",
    name: "Capsules Classic",
    subtitle: "Value Pack",
    image: capsuleClassic50,
    description:
      "The Classic blend in a larger pack for regular use at home or in the office.",
    price: 1000 / EUR_TO_MKD_RATE,
    netWeight: "50 capsules x 5.5 g (275 g)",
    roast: "Medium",
    intensity: "7/10",
    format: "Box of 50 capsules",
    compatibility: "Compatible with Nespresso Original machines",
    imageClassName: "mix-blend-multiply translate-y-5",
  },
  {
    id: "capsules-aroma",
    name: "Capsules Aroma",
    image: capsuleAroma,
    description:
      "A medium-dark roast with floral notes and a cocoa finish.",
    price: 200 / EUR_TO_MKD_RATE,
    netWeight: "10 capsules x 5 g (50 g)",
    roast: "Medium-Dark",
    intensity: "8/10",
    format: "Box of 10 capsules",
    compatibility: "Compatible with Nespresso Original machines",
    imageClassName: "",
  },
];

const espressoProducts = [
  {
    id: "espresso-classic",
    name: "Galla Classic",
    image: classicCoffee,
    description:
      "A blend of high-quality Arabica and selected Robusta beans from South America, with smooth crema and an intense flavor.",
  },
  {
    id: "espresso-aroma",
    name: "Galla Aroma",
    image: aromaCoffee,
    description:
      "A medium-roast blend of high-quality Arabica and Asian Robusta, with a rich aroma and balanced flavor.",
  },
  {
    id: "espresso-cream",
    name: "Galla Cream",
    image: creamCoffee,
    description:
      "A balanced, medium-roast blend with a creamy texture and a clean finish.",
  },
  {
    id: "espresso-black",
    name: "Galla Black",
    image: blackCoffee,
    description:
      "A full-bodied espresso blend with a rich aroma and balanced acidity.",
  },
];

const CART_STORAGE_KEY = "galla_capsules_cart";
const ORDER_DRAFT_STORAGE_KEY = "galla_order_draft";
const EMPTY_ORDER_FORM = {
  customerName: "", customerEmail: "", customerPhone: "",
  deliveryAddress: "", city: "", postalCode: "", note: "",
};
const SHIPPING_MKD = 120;
const FREE_SHIPPING_MKD = 2150;
const toMkd = (eur: number) => Math.round(eur * EUR_TO_MKD_RATE);
const dualPrice = (mkd: number, rate = EUR_TO_MKD_RATE) => `EUR ${(mkd / rate).toFixed(2)} / ${mkd} MKD`;
const INITIAL_CAPSULE_QTY = Object.fromEntries(capsuleProducts.map((product) => [product.id, 0])) as Record<string, number>;
const capsuleTranslations = {
  en: {
    home: "Home",
    perCapsule: "per capsule",
    shopTitle: "Galla Capsules",
    shopIntro: "Choose your blend and pack size. Compatible with Nespresso Original machines.",
    chooseCapsules: "Choose your capsules",
    checkout: "Checkout",
    productDetails: "Product details",
    addPack: "Add a pack",

    capsules: "Capsules",
    newProductLine: "The Art of Espresso",
    title: "The Art of Espresso, Encapsulated",
    intro: "Discover the exquisite Galla collection.",
    capsClassic: "Classic Capsules",
    capsAroma: "Aroma Capsules",
    standardPack: "Standard Pack",
    valuePack: "Value Pack",
    weight: "Weight",
    roast: "Roast",
    intensity: "Intensity",
    format: "Format",
    compatibility: "Compatibility",
    inStock: "In stock",
    outOfStock: "Out of stock",
    leftInStock: "left",
    dispatch24: "Delivery in 3–5 business days",
    vatIncluded: "VAT included",
    orderSummary: "Order Summary",
    packsSelected: "Packs selected",
    emptyCart: "Empty Cart",
    yourName: "Your name",
    yourEmail: "Your email",
    phone: "Phone number",
    phoneOptional: "Phone number (optional)",
    deliveryAddress: "Street and delivery address",
    city: "City",
    postalCodeOptional: "Postal code (optional)",
    paymentMethod: "Payment method",
    cashOnDelivery: "Cash on delivery",
    cashOnDeliveryHelp: "Pay the courier in cash in MKD when your order arrives.",
    orderNoteOptional: "Order note (optional)",
    noProducts: "No products selected yet.",
    subtotal: "Subtotal",
    shipping: "Shipping",
    total: "Total",
    free: "Free",
    submitting: "Submitting...",
    placeOrder: "Place Order",
    orderSuccess: "Order placed successfully. Payment is due in cash on delivery.",
    confirmationTitle: "Thank you for your order",
    continueShopping: "Continue shopping",
    emailUnavailable: "Your order has been received. We could not send the confirmation email. Please keep your order number for reference.",
    orderNumber: "Order number",
    confirmationEmail: "Your order details have been emailed to",
    acceptPolicies: "I have read and agree to:",
    orderFailed: "Could not submit your order.",
    freeShippingNote: "Delivery across North Macedonia in 3–5 business days. Delivery is 120 MKD and free above 2,150 MKD.",
    ordersSubmittedApi: "Please check your contact and delivery details before placing your order.",
    espressoProducts: "Espresso Products",
    alsoAvailable: "Also Available to Order",
    espressoIntro:
      "Classic, Aroma, Cream, and Black espresso blends are also available to order. Contact us for prices and order details.",
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
    perCapsule: "për kapsulë",
    shopTitle: "Kapsulat Galla",
    shopIntro: "Zgjidhni përzierjen dhe madhësinë e paketës. Të përshtatshme për makinat Nespresso Original.",
    chooseCapsules: "Zgjidhni kapsulat",
    checkout: "Përfundoni porosinë",
    productDetails: "Detajet e produktit",
    addPack: "Shtoni një paketë",

    capsules: "Kapsula",
    newProductLine: "Arti i espressos",
    title: "Espresso në kapsula",
    intro: "Zbuloni koleksionin e kapsulave Galla.",
    capsClassic: "Kapsula Classic",
    capsAroma: "Kapsula Aroma",
    standardPack: "Paketë standarde",
    valuePack: "Paketë ekonomike",
    weight: "Pesha",
    roast: "Pjekja",
    intensity: "Intensiteti",
    format: "Formati",
    compatibility: "Përputhshmëria",
    inStock: "Në stok",
    outOfStock: "Nuk është në stok",
    leftInStock: "të mbetura",
    dispatch24: "Dorëzim brenda 3–5 ditëve pune",
    vatIncluded: "TVSH e përfshirë",
    orderSummary: "Përmbledhja e porosisë",
    packsSelected: "Paketa të zgjedhura",
    emptyCart: "Zbrazni shportën",
    yourName: "Emri juaj",
    yourEmail: "Email-i juaj",
    phone: "Numri i telefonit",
    phoneOptional: "Numri i telefonit (opsional)",
    deliveryAddress: "Rruga dhe adresa e dorëzimit",
    city: "Qyteti",
    postalCodeOptional: "Kodi postar (opsional)",
    paymentMethod: "Mënyra e pagesës",
    cashOnDelivery: "Pagesë me para në dorë gjatë dorëzimit",
    cashOnDeliveryHelp: "Paguani korrierin me para në dorë në MKD kur të mbërrijë porosia.",
    orderNoteOptional: "Shënim porosie (opsional)",
    noProducts: "Ende nuk ka produkte të zgjedhura.",
    subtotal: "Nëntotali",
    shipping: "Transporti",
    total: "Totali",
    free: "Falas",
    submitting: "Duke dërguar...",
    placeOrder: "Bëni porosinë",
    orderSuccess: "Porosia u krye me sukses. Pagesa bëhet me para në dorë gjatë dorëzimit.",
    confirmationTitle: "Faleminderit për porosinë tuaj",
    continueShopping: "Vazhdoni blerjet",
    emailUnavailable: "Porosia juaj u pranua. Emaili i konfirmimit nuk mund të dërgohej. Ju lutemi ruani numrin e porosisë.",
    orderNumber: "Numri i porosisë",
    confirmationEmail: "Një email konfirmimi u dërgua te",
    acceptPolicies: "I kam lexuar dhe i pranoj:",
    orderFailed: "Dërgimi i porosisë dështoi.",
    freeShippingNote: "Dorëzim në gjithë Maqedoninë e Veriut brenda 3–5 ditëve pune. Transporti kushton 120 MKD dhe është falas mbi 2.150 MKD.",
    ordersSubmittedApi: "Ju lutemi, kontrolloni të dhënat e kontaktit dhe adresën e dorëzimit përpara se të bëni porosinë.",
    espressoProducts: "Përzierje për espresso",
    alsoAvailable: "Gjithashtu në dispozicion për porosi",
    espressoIntro:
      "Përzierjet Classic, Aroma, Cream dhe Black janë gjithashtu të disponueshme për porosi. Na kontaktoni për çmimet dhe detajet e porosisë.",
    availableForOrder: "Në dispozicion për porosi",
    requestOffer: "Kërkoni ofertë",
    espressoInquiryForm: "Kërkesë për përzierje espresso",
    messageOptional: "Mesazh (opsional)",
    sendInquiry: "Dërgoni kërkesën",
    inquirySuccess: "Kërkesa u dërgua me sukses.",
    inquiryFailed: "Dërgimi i kërkesës dështoi.",
  },
  mk: {
    home: "Почетна",
    perCapsule: "по капсула",
    shopTitle: "Капсули Galla",
    shopIntro: "Изберете мешавина и големина на пакување. Компатибилни со машините Nespresso Original.",
    chooseCapsules: "Изберете капсули",
    checkout: "Завршете ја нарачката",
    productDetails: "Детали за производот",
    addPack: "Додајте пакување",

    capsules: "Капсули",
    newProductLine: "Уметноста на еспресото",
    title: "Еспресо во капсули",
    intro: "Откријте ја колекцијата капсули Galla.",
    capsClassic: "Капсули Classic",
    capsAroma: "Капсули Aroma",
    standardPack: "Стандардно пакување",
    valuePack: "Економично пакување",
    weight: "Тежина",
    roast: "Печење",
    intensity: "Интензитет",
    format: "Формат",
    compatibility: "Компатибилност",
    inStock: "На залиха",
    outOfStock: "Нема на залиха",
    leftInStock: "преостанати",
    dispatch24: "Испорака за 3–5 работни дена",
    vatIncluded: "Вклучен ДДВ",
    orderSummary: "Преглед на нарачката",
    packsSelected: "Избрани пакувања",
    emptyCart: "Испразнете ја кошничката",
    yourName: "Вашето име",
    yourEmail: "Вашата е-пошта",
    phone: "Телефонски број",
    phoneOptional: "Телефонски број (опционално)",
    deliveryAddress: "Улица и адреса за достава",
    city: "Град",
    postalCodeOptional: "Поштенски број (опционално)",
    paymentMethod: "Начин на плаќање",
    cashOnDelivery: "Плаќање во готово при достава",
    cashOnDeliveryHelp: "Платете му на курирот во готово, во денари, кога ќе пристигне нарачката.",
    orderNoteOptional: "Белешка за нарачка (опционално)",
    noProducts: "Сè уште нема избрани производи.",
    subtotal: "Меѓузбир",
    shipping: "Достава",
    total: "Вкупно",
    free: "Бесплатно",
    submitting: "Се испраќа...",
    placeOrder: "Нарачајте",
    orderSuccess: "Нарачката е успешно направена. Плаќањето е во готово при достава.",
    confirmationTitle: "Ви благодариме за нарачката",
    continueShopping: "Продолжете со купување",
    emailUnavailable: "Вашата нарачка е примена. Е-поштата за потврда не можеше да се испрати. Зачувајте го бројот на нарачката.",
    orderNumber: "Број на нарачка",
    confirmationEmail: "Е-пошта за потврда е испратена до",
    acceptPolicies: "Ги прочитав и ги прифаќам:",
    orderFailed: "Неуспешно испраќање на нарачка.",
    freeShippingNote: "Испорака низ Северна Македонија за 3–5 работни дена. Доставата е 120 денари и е бесплатна над 2.150 денари.",
    ordersSubmittedApi: "Проверете ги контакт-информациите и адресата за достава пред да ја поднесете нарачката.",
    espressoProducts: "Мешавини за еспресо",
    alsoAvailable: "Достапни и за нарачка",
    espressoIntro:
      "Мешавините Classic, Aroma, Cream и Black се исто така достапни за нарачка. Контактирајте нè за цени и детали за нарачката.",
    availableForOrder: "Достапно за нарачка",
    requestOffer: "Побарајте понуда",
    espressoInquiryForm: "Барање за мешавини за еспресо",
    messageOptional: "Порака (опционално)",
    sendInquiry: "Испратете барање",
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
  const [productAvailability, setProductAvailability] = useState<Record<string, { inStock: boolean; stockQuantity: number | null }>>(
    Object.fromEntries(capsuleProducts.map((product) => [product.id, { inStock: true, stockQuantity: null }])),
  );

  const selectedCapsules = useMemo(
    () => capsuleProducts.filter((product) => capsuleQty[product.id] > 0),
    [capsuleQty],
  );

  const totalCapsulePacks = selectedCapsules.reduce((sum, product) => sum + capsuleQty[product.id], 0);
  const capsuleTotalMkd = selectedCapsules.reduce(
    (sum, product) => sum + toMkd(product.price) * capsuleQty[product.id],
    0,
  );
  const shippingFeeMkd = totalCapsulePacks === 0 ? 0 : capsuleTotalMkd >= FREE_SHIPPING_MKD ? 0 : SHIPPING_MKD;
  const finalTotalMkd = capsuleTotalMkd + shippingFeeMkd;
  const hasCapsuleSelection = totalCapsulePacks > 0;
  const [orderForm, setOrderForm] = useState(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(ORDER_DRAFT_STORAGE_KEY) || "null");
      return Object.fromEntries(Object.entries(EMPTY_ORDER_FORM).map(([key, value]) =>
        [key, typeof saved?.[key] === "string" ? saved[key] : value],
      )) as typeof EMPTY_ORDER_FORM;
    } catch {
      return { ...EMPTY_ORDER_FORM };
    }
  });
  const [orderSubmitState, setOrderSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [orderSubmitMessage, setOrderSubmitMessage] = useState("");
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<{
    confirmationEmailSent: boolean;
    orderNumber: string;
    customerEmail: string;
    totalCents: number;
    currency: string;
    eurToMkdRate: number;
  } | null>(null);
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
    if (Object.values(capsuleQty).some((quantity) => quantity > 0)) {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(capsuleQty));
    } else {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, [capsuleQty]);

  useEffect(() => {
    if (Object.values(orderForm).some((value) => value !== "")) {
      window.localStorage.setItem(ORDER_DRAFT_STORAGE_KEY, JSON.stringify(orderForm));
    } else {
      window.localStorage.removeItem(ORDER_DRAFT_STORAGE_KEY);
    }
  }, [orderForm]);

  useEffect(() => {
    getProducts()
      .then((result) => {
        if (!result.data) return;
        setProductAvailability((current) => ({
          ...current,
          ...Object.fromEntries(
            result.data
              .filter((product) => product.id.startsWith("capsules-"))
              .map((product) => [product.id, { inStock: product.inStock, stockQuantity: product.stockQuantity }]),
          ),
        }));
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  }, [lang]);

  useEffect(() => {
    if (confirmedOrder) document.getElementById("order-confirmation")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [confirmedOrder]);

  const increaseCapsule = (id: string) => {
    const availability = productAvailability[id];
    if (!availability?.inStock) return;
    setConfirmedOrder(null);
    setCapsuleQty((prev) => ({
      ...prev,
      [id]: availability.stockQuantity === null ? prev[id] + 1 : Math.min(prev[id] + 1, availability.stockQuantity),
    }));
  };

  const decreaseCapsule = (id: string) => {
    setCapsuleQty((prev) => ({ ...prev, [id]: Math.max(0, prev[id] - 1) }));
  };

  const clearCart = () => {
    setCapsuleQty({ ...INITIAL_CAPSULE_QTY });
  };

  const handleCapsuleOrderSubmit = async () => {
    if (!hasCapsuleSelection || !normalizeMacedonianPhone(orderForm.customerPhone)) return;

    setOrderSubmitState("loading");
    setOrderSubmitMessage("");
    try {
      const result = await placeCapsuleOrder({
        customerName: orderForm.customerName,
        customerEmail: orderForm.customerEmail,
        customerPhone: normalizeMacedonianPhone(orderForm.customerPhone)!,
        deliveryAddress: orderForm.deliveryAddress,
        city: orderForm.city,
        postalCode: orderForm.postalCode || undefined,
        paymentMethod: "CASH_ON_DELIVERY",
        note: orderForm.note || undefined,
        items: selectedCapsules.map((product) => ({
          productId: product.id,
          quantity: capsuleQty[product.id],
        })),
      });

      if (!result.data) {
        throw new Error(t.orderFailed);
      }

      setOrderSubmitState("success");
      setOrderSubmitMessage(t.orderSuccess);
      setConfirmedOrder({ ...result.data, confirmationEmailSent: result.confirmationEmailSent === true });
      setCapsuleQty({ ...INITIAL_CAPSULE_QTY });
      window.localStorage.removeItem(CART_STORAGE_KEY);
      window.localStorage.removeItem(ORDER_DRAFT_STORAGE_KEY);
      setOrderForm({ ...EMPTY_ORDER_FORM });
      setAcceptedPolicies(false);
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
    <div className="min-h-screen pb-24 bg-[#faf9f7] font-['Inter',sans-serif] text-[#1f1f1f]">
      <CompactHeader cartCount={totalCapsulePacks} cartHref="#order-summary" lang={lang} onLangChange={setLang} />
      <div className="pb-14 pt-8 md:pb-20 md:pt-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.1em] text-[#787878]">
            <Link to="/" className="transition-colors hover:text-[#9e0102]">
              {t.home}
            </Link>{" "}
            &gt; <span className="text-[#9e0102]">{t.capsules}</span>
          </p>
          <h1 className="mt-6 text-4xl font-medium tracking-tight md:text-5xl">{t.shopTitle}</h1>
          <p className="mt-3 font-serif text-2xl leading-8 text-[#9e0102] md:text-3xl">{t.newProductLine}</p>
          <p className="mt-5 text-base leading-8 text-[#3a3a3a] md:text-lg">
            {t.shopIntro}
          </p>
        </div>

        <nav aria-label={t.capsules} className="mt-7 flex flex-wrap gap-3 border-b border-[#e3ddd6] pb-6 text-sm font-medium">
          <a href="#capsule-collection" className="rounded-full bg-[#9e0102] px-5 py-2.5 text-white">{t.chooseCapsules}</a>
          <a href="#order-summary" className="rounded-full border border-[#d8cfc5] px-5 py-2.5 hover:bg-white">{t.checkout}{totalCapsulePacks > 0 ? ` (${totalCapsulePacks})` : ""}</a>
          <a href="#espresso-collection" className="rounded-full border border-[#d8cfc5] px-5 py-2.5 hover:bg-white">{t.espressoProducts}</a>
        </nav>
        <p className="mt-4 text-xs leading-6 text-[#71665c]">{t.freeShippingNote}</p>

        {confirmedOrder && (
          <section
            id="order-confirmation"
            aria-live="polite"
            className="mx-auto mt-10 max-w-2xl rounded-[12px] border border-green-300 bg-green-50 px-5 py-6 text-center shadow-sm"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-800">{t.confirmationTitle}</p>
            <p className="mt-2 text-lg font-bold text-[#1f1f1f]">
              {t.orderNumber}: {confirmedOrder.orderNumber}
            </p>
            <p className="mt-2 text-sm text-[#3f4f43]">{t.orderSuccess}</p>
            <p className="mt-1 text-sm text-[#3f4f43]">
              {t.total}: {dualPrice(confirmedOrder.totalCents / 100, confirmedOrder.eurToMkdRate)}
            </p>
            <p className="mt-1 text-xs text-[#536057]">
              {confirmedOrder.confirmationEmailSent ? `${t.confirmationEmail} ${confirmedOrder.customerEmail}.` : t.emailUnavailable}
            </p>
            <button
              type="button"
              className="mt-5 rounded-md bg-[#9e0102] px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
              onClick={() => {
                setConfirmedOrder(null);
                setOrderSubmitState("idle");
                setOrderSubmitMessage("");
                document.getElementById("capsule-collection")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              {t.continueShopping}
            </button>
          </section>
        )}

        <div className="mt-8">
          <div id="capsule-collection" className="grid scroll-mt-28 grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {capsuleProducts.map((product) => (
              <article
                key={product.id}
                className="flex min-w-0 flex-col rounded-xl border border-[#e5dfd8] bg-white p-5 md:p-6"
              >
                <ProductImage
                  image={product.image}
                  name={product.name}
                  overlay={<span className="rounded-full bg-[#f3efea] px-3 py-1.5 text-xs font-semibold text-[#574a3e]">{product.id === "capsules-classic-50x" ? "50" : "10"} {t.capsules.toLowerCase()}</span>}
                />

                <div className="mt-4 flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-2xl font-medium leading-tight tracking-tight">
                        {product.id.startsWith("capsules-classic") ? t.capsClassic : t.capsAroma}
                      </h2>
                      {(
                        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#6d6d6d]">
                          {product.id === "capsules-classic-50x" ? t.valuePack : t.standardPack}
                        </p>
                      )}
                    </div>
                    <p className="text-right text-sm font-bold leading-5 text-[#9e0102]">
                      {toMkd(product.price)} MKD<br /><span className="text-xs font-normal text-[#77695d]">EUR {product.price.toFixed(2)}</span>
                    </p>
                  </div>
                  <p className="mt-1 text-[11px] text-[#77695d]">{t.vatIncluded}</p>
                  <p className="mt-2 min-h-[72px] text-sm leading-7 text-[#4f4f4f]">{product.description}</p>

                  <div className="mt-4 flex items-center gap-3 border-t border-[#eee8e1] pt-4 text-xs">
                    <span className="font-semibold">{t.intensity} {product.intensity}</span>
                    <div className="flex gap-1" aria-hidden="true">{Array.from({ length: 10 }, (_, index) => <span key={index} className={`h-1.5 w-2 rounded-sm ${index < Number(product.intensity.split("/")[0]) ? "bg-[#9e0102]" : "bg-[#e8e1d8]"}`} />)}</div>
                  </div>
                  <details className="mt-4 text-xs leading-6 text-[#62564a]">
                    <summary className="cursor-pointer font-medium text-[#29231e]">{t.productDetails}</summary>
                    <p className="mt-2">{t.weight}: {product.netWeight}</p>
                    <p>{t.roast}: {product.roast}</p>
                    <p>{t.compatibility}: {product.compatibility}</p>
                  </details>

                  <div className="mb-5 mt-4 flex items-center justify-between gap-2 text-xs">
                    <p className={`font-semibold ${productAvailability[product.id]?.inStock ? "text-green-700" : "text-red-700"}`}>
                      {productAvailability[product.id]?.inStock ? t.inStock : t.outOfStock}
                      {productAvailability[product.id]?.stockQuantity !== null && productAvailability[product.id]?.stockQuantity !== undefined
                        ? ` · ${productAvailability[product.id].stockQuantity} ${t.leftInStock}`
                        : ""}
                    </p>
                    <p className="text-[#5a5a5a]">{t.dispatch24}</p>
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-[#e6ddd4] pt-4">
                    <div className="inline-flex items-center rounded-md border border-[#cab8a6]">
                      <button
                        type="button"
                        aria-label={`${t.packsSelected}: − ${product.name}`}
                        onClick={() => decreaseCapsule(product.id)}
                        className="h-9 w-9 text-lg leading-none transition-colors hover:bg-[#f4ece4]"
                      >
                        -
                      </button>
                      <span className="w-10 text-center text-sm font-semibold">{capsuleQty[product.id]}</span>
                      <button
                        type="button"
                        aria-label={`${t.addPack}: ${product.name}`}
                        onClick={() => increaseCapsule(product.id)}
                        disabled={
                          !productAvailability[product.id]?.inStock ||
                          (productAvailability[product.id]?.stockQuantity !== null &&
                            capsuleQty[product.id] >= productAvailability[product.id].stockQuantity)
                        }
                        className="h-9 w-9 text-lg leading-none transition-colors hover:bg-[#f4ece4] disabled:cursor-not-allowed disabled:opacity-35"
                      >
                        +
                      </button>
                    </div>
                    <button type="button" onClick={() => increaseCapsule(product.id)} disabled={!productAvailability[product.id]?.inStock || (productAvailability[product.id]?.stockQuantity != null && capsuleQty[product.id] >= productAvailability[product.id].stockQuantity)} className="rounded-md bg-[#9e0102] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#800102] disabled:cursor-not-allowed disabled:opacity-40">{t.addPack}</button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside id="order-summary" className="mt-10 scroll-mt-28 rounded-xl border border-[#e8e1d8] bg-white p-6 md:p-8">
            <h2 className="mb-5 text-2xl font-semibold tracking-tight">{t.checkout}</h2>
            {!hasCapsuleSelection && <p className="text-sm text-[#62564a]">{t.noProducts} <a href="#capsule-collection" className="text-[#9e0102] underline">{t.chooseCapsules}</a></p>}
            {hasCapsuleSelection && <>
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

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <input
                type="text"
                value={orderForm.customerName}
                onChange={(event) => setOrderForm((prev) => ({ ...prev, customerName: event.target.value }))}
                aria-label={t.yourName}
                placeholder={t.yourName}
                className="w-full rounded-[6px] border border-[#E0E0E0] px-3 py-3 text-sm outline-none focus:border-[#9e0102]"
              />
              <input
                type="email"
                value={orderForm.customerEmail}
                onChange={(event) => setOrderForm((prev) => ({ ...prev, customerEmail: event.target.value }))}
                aria-label={t.yourEmail}
                placeholder={t.yourEmail}
                className="w-full rounded-[6px] border border-[#E0E0E0] px-3 py-3 text-sm outline-none focus:border-[#9e0102]"
              />
              <input
                type="tel"
                value={orderForm.customerPhone}
                onChange={(event) => setOrderForm((prev) => ({ ...prev, customerPhone: event.target.value.replace(/[^\d+\s()-]/g, "") }))}
                aria-label={t.phone}
                placeholder="+389 71 234 567"
                inputMode="tel"
                maxLength={24}
                aria-invalid={Boolean(orderForm.customerPhone && !normalizeMacedonianPhone(orderForm.customerPhone))}
                required
                className="w-full rounded-[6px] border border-[#E0E0E0] px-3 py-3 text-sm outline-none focus:border-[#9e0102]"
              />
              <p className="text-xs text-[#71665c] md:col-span-2" role="status">
                {lang === "sq" ? "Përdorni një numër të Maqedonisë së Veriut: +389 ose prefiksin lokal 0. Dërgesat kryhen vetëm brenda Maqedonisë së Veriut."
                  : lang === "mk" ? "Користете број од Северна Македонија: +389 или локален префикс 0. Доставата е само во Северна Македонија."
                  : "Use a North Macedonian number: +389 or the local 0 prefix. Delivery is within North Macedonia only."}
              </p>
              <input
                type="text"
                value={orderForm.deliveryAddress}
                onChange={(event) => setOrderForm((prev) => ({ ...prev, deliveryAddress: event.target.value }))}
                aria-label={t.deliveryAddress}
                placeholder={t.deliveryAddress}
                autoComplete="street-address"
                required
                className="w-full rounded-[6px] border border-[#E0E0E0] px-3 py-3 text-sm outline-none focus:border-[#9e0102]"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={orderForm.city}
                  onChange={(event) => setOrderForm((prev) => ({ ...prev, city: event.target.value }))}
                  aria-label={t.city}
                placeholder={t.city}
                  autoComplete="address-level2"
                  required
                  className="w-full rounded-[6px] border border-[#E0E0E0] px-3 py-3 text-sm outline-none focus:border-[#9e0102]"
                />
                <input
                  type="text"
                  value={orderForm.postalCode}
                  onChange={(event) => setOrderForm((prev) => ({ ...prev, postalCode: event.target.value }))}
                  aria-label={t.postalCodeOptional}
                placeholder={t.postalCodeOptional}
                  autoComplete="postal-code"
                  className="w-full rounded-[6px] border border-[#E0E0E0] px-3 py-3 text-sm outline-none focus:border-[#9e0102]"
                />
              </div>
              <textarea
                value={orderForm.note}
                onChange={(event) => setOrderForm((prev) => ({ ...prev, note: event.target.value }))}
                aria-label={t.orderNoteOptional}
                placeholder={t.orderNoteOptional}
                rows={3}
                className="w-full resize-y rounded-[6px] border border-[#E0E0E0] px-3 py-3 text-sm outline-none focus:border-[#9e0102]"
              />
            </div>

            <fieldset className="mt-4">
              <legend className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6d6259]">
                {t.paymentMethod}
              </legend>
              <label className="mt-2 flex cursor-pointer gap-3 rounded-[6px] border border-[#9e0102] bg-[#fff8f6] p-3">
                <input type="radio" name="paymentMethod" value="CASH_ON_DELIVERY" checked readOnly className="mt-1 accent-[#9e0102]" />
                <span>
                  <span className="block text-sm font-semibold text-[#1f1f1f]">{t.cashOnDelivery}</span>
                  <span className="mt-0.5 block text-xs leading-5 text-[#6d6259]">{t.cashOnDeliveryHelp}</span>
                </span>
              </label>
            </fieldset>

            <div className="mt-4 space-y-2 border-b border-[#e8ddd2] pb-4 text-sm text-[#383838]">
              {selectedCapsules.length === 0 ? (
                <p>{t.noProducts}</p>
              ) : (
                selectedCapsules.map((product) => (
                  <div key={product.id} className="flex items-center justify-between gap-2">
                    <p className="line-clamp-1">{product.name} x {capsuleQty[product.id]}</p>
                    <p className="text-right font-medium">{dualPrice(capsuleQty[product.id] * toMkd(product.price))}</p>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between text-[#4b4b4b]">
                <p>{t.subtotal}</p>
                <p>{dualPrice(capsuleTotalMkd)}</p>
              </div>
              <div className="flex items-center justify-between text-[#4b4b4b]">
                <p>{t.shipping}</p>
                <p>{shippingFeeMkd === 0 ? t.free : dualPrice(shippingFeeMkd)}</p>
              </div>
              <div className="flex items-center justify-between border-t border-[#e8ddd2] pt-3 text-base font-bold text-[#1f1f1f]">
                <p>{t.total}</p>
                <p>{dualPrice(finalTotalMkd)}</p>
              </div>
            </div>

            <label className="mt-4 flex items-start gap-2 text-xs leading-5 text-[#554b43]">
              <input
                type="checkbox"
                checked={acceptedPolicies}
                onChange={(event) => setAcceptedPolicies(event.target.checked)}
                className="mt-1 accent-[#9e0102]"
              />
              <span>
                {t.acceptPolicies}{" "}
                <Link to="/terms" target="_blank" rel="noreferrer" className="font-semibold text-[#9e0102] underline">Terms</Link>
                {" · "}
                <Link to="/privacy" target="_blank" rel="noreferrer" className="font-semibold text-[#9e0102] underline">Privacy</Link>
              </span>
            </label>

            <button
              type="button"
              onClick={handleCapsuleOrderSubmit}
              disabled={
                orderSubmitState === "loading" ||
                !orderForm.customerName.trim() ||
                !orderForm.customerEmail.trim() ||
                !normalizeMacedonianPhone(orderForm.customerPhone) ||
                !orderForm.deliveryAddress.trim() ||
                !orderForm.city.trim() ||
                !acceptedPolicies ||
                !hasCapsuleSelection
              }
              className="mt-5 inline-flex w-full items-center justify-center rounded-[6px] bg-[#8B1A1A] px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition-colors duration-200 hover:bg-[#741313] disabled:cursor-not-allowed disabled:opacity-40"
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
            </>}
          </aside>
        </div>

        <div id="espresso-collection" className="mt-16 scroll-mt-28 border-t border-[#dbcfc4] pt-12">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9e0102]">{t.espressoProducts}</p>
          <h2 className="mt-2 text-3xl font-medium tracking-tight md:text-4xl">{t.alsoAvailable}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#4a4a4a] md:text-base">
            {t.espressoIntro}
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {espressoProducts.map((product) => (
              <article key={product.id} className="flex flex-col rounded-xl border border-[#e5dfd8] bg-white p-6">
                <ProductImage image={product.image} name={product.name} />
                <h3 className="mt-4 text-2xl font-medium tracking-tight text-[#1f1f1f]">{product.name}</h3>
                <p className="mt-2 text-sm leading-7 text-[#4f4f4f]">{product.description}</p>
                <div className="mt-auto flex items-center justify-between gap-3 pt-4">
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
            className="mt-8 rounded-xl border border-[#e5dfd8] bg-white p-6"
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
                aria-label={t.yourName}
                placeholder={t.yourName}
                className="w-full rounded-md border border-[#d6c8bb] px-3 py-2 text-sm outline-none focus:border-[#9e0102]"
              />
              <input
                type="email"
                required
                value={espressoForm.customerEmail}
                onChange={(event) => setEspressoForm((prev) => ({ ...prev, customerEmail: event.target.value }))}
                aria-label={t.yourEmail}
                placeholder={t.yourEmail}
                className="w-full rounded-md border border-[#d6c8bb] px-3 py-2 text-sm outline-none focus:border-[#9e0102]"
              />
              <input
                type="text"
                value={espressoForm.customerPhone}
                onChange={(event) => setEspressoForm((prev) => ({ ...prev, customerPhone: event.target.value }))}
                aria-label={t.phoneOptional}
                placeholder={t.phoneOptional}
                className="w-full rounded-md border border-[#d6c8bb] px-3 py-2 text-sm outline-none focus:border-[#9e0102]"
              />
              <textarea
                value={espressoForm.message}
                onChange={(event) => setEspressoForm((prev) => ({ ...prev, message: event.target.value }))}
                aria-label={t.messageOptional}
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
      {hasCapsuleSelection && <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#dfd6cb] bg-white/95 px-4 py-3 shadow-lg backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div><p className="text-xs text-[#71665c]">{t.packsSelected}: {totalCapsulePacks}</p><p className="text-sm font-semibold">{dualPrice(finalTotalMkd)}</p></div>
          <a href="#order-summary" className="rounded-md bg-[#9e0102] px-5 py-3 text-sm font-semibold text-white">{t.checkout}</a>
        </div>
      </div>}
      <StoreFooter />
    </div>
  );
};

export default Capsules;
