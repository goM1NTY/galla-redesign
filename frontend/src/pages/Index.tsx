import { FormEvent, useEffect, useState } from "react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { sendContact } from "@/lib/api";
import classicCoffee from "@/assets/classic-coffee.webp";
import aromaCoffee from "@/assets/aroma-coffee.webp";
import blackCoffee from "@/assets/black-coffee.webp";
import creamCoffee from "@/assets/cream-coffee.webp";
import espressoPhoto from "@/assets/5.jpeg";
import capsulesPhoto from "@/assets/capsules.webp";
import capsulesClassic from "@/assets/capsules-classic-cropped.webp";
import aromaCapsules from "@/assets/aromacaps-cropped.png";

type Language = "en" | "sq" | "mk";
const LANGUAGE_STORAGE_KEY = "galla_lang";

const translations = {
  en: {
    espressoLabel: "Galla Espresso",
    espressoTitle: "Italian Roast, Balanced Character",
    fromBean: "From Bean to Cup",
    fromBeanDesc: "Carefully selected green beans, precision roasting, and controlled blending create a consistent cup.",
    espressoIntro:
      "Our espresso blends combine selected Arabica and Robusta beans with Italian-style roasting for a sweet, aromatic cup.",
    classicDesc:
      "High-quality Arabica and selected Robusta from South America. A longer roast produces smooth crema and an intense espresso.",
    aromaDesc: "High-quality Arabica and Asian Robusta for a rich aroma and balanced body.",
    creamDesc: "A medium-roast blend with a creamy texture and a clean finish.",
    premiumLabel: "Black Premium",
    premiumTitle: "100% Arabica Espresso",
    premiumP1: "Black Premium combines carefully selected Arabica beans from Brazil and Africa.",
    premiumP2: "A full-bodied espresso with a rich aroma and balanced acidity.",
    p200Label: "Since 2016",
    p200Desc: "Part of the Galla range since 2016, Black Premium brings together selected origins in a balanced blend.",
    hospitalityLabel: "For cafés and hotels",
    hospitalityDesc: "Rich flavor and consistent crema for professional espresso service in cafés, restaurants, and hotels.",
    signatureProduct: "Galla Collection",
    premiumQuoteText: "Selected origins. Balanced flavor.",
    premiumQuote: "100% Arabica",
    capsulesLabel: "New Product Line",
    capsulesTitle: "Galla Capsules",
    capsulesIntro: "Explore Galla capsules and order your preferred blend online.",
    capClassic: "Classic Capsules",
    capAroma: "Aroma Capsules",
    capBlack: "Black Capsules",
    capClassicDesc: "A smooth, balanced espresso with soft crema for everyday enjoyment.",
    capAromaDesc: "A rich aroma and a delicate aftertaste.",
    capBlackDesc: "A full-bodied espresso with a deeper roast and a lingering finish.",
    weight: "Weight",
    roast: "Roast",
    intensity: "Intensity",
    format: "Format",
    formatValue: "Box of 10 capsules",
    compatibility: "Compatibility",
    inStock: "In stock",
    dispatch24: "Dispatch within 24 hours",
    vatIncluded: "VAT included",
    orderSummary: "Order Summary",
    packsSelected: "Packs selected",
    noProducts: "No products selected yet.",
    subtotal: "Subtotal",
    shipping: "Shipping",
    total: "Total",
    free: "Free",
    proceed: "Proceed to Order",
    freeShippingNote: "Free shipping above EUR 35. Orders are prepared within 24 hours.",
    checkoutOpens: "Checkout currently opens email to",
    aboutLabel: "About Us",
    aboutTitle: "Crafted Since 2005",
    aboutP1: "Since 2005, Galla has specialized in coffee roasting and the production of espresso blends.",
    aboutP2: "With years of experience in roasting, packaging, and coffee distribution, Galla Caffe offers espresso blends in a range of flavors and pack sizes.",
    aboutP3: "We use Italian-style roasting and carefully selected coffee beans. Each blend is roasted, mixed, and packed to preserve its aroma, flavor, and freshness.",
    aboutP4: "Our focus is quality coffee for everyday enjoyment.",
    whatLabel: "What Makes Galla Different",
    whatP1: "Italian-style roasting and selected beans produce a balanced espresso with consistent aroma, crema, and body.",
    whatP2: "Our blends suit both home preparation and professional service, with a focus on quality and freshness.",
    whatP3: "We develop our blends and packaging through ongoing quality control and product improvement.",
    sending: "Sending...",
    contactSuccess: "Message sent successfully. We will contact you shortly.",
    contactFailed: "Could not send your message.",
    contactUs: "Contact Us",
    storeInformation: "Store Information",
    shippingPolicy: "Shipping & Delivery",
    returnsPolicy: "Returns & Refunds",
    termsPolicy: "Terms & Conditions",
    privacyPolicy: "Privacy Policy",
    companyDetails: "Company Details",
    privacySettings: "Privacy settings",

    infoAddress: "Contact Details",
    kosovo: "Kosovo",
    nameRequired: "Your Name (required)",
    emailRequired: "Your Email (required)",
    subject: "Subject",
    message: "Your Message",
    send: "Send",
    footerTag: "Coffee blends and capsules, roasted in the Italian tradition since 2005.",
    quickLinks: "Explore",
    coffeeCollection: "Coffee Collection",
    customerService: "Customer Service",
    products: "Products",
    contact: "Contact",
    rights: "All rights reserved.",
  },
  sq: {
    espressoLabel: "Galla Espresso", espressoTitle: "Pjekje italiane, shije e balancuar",
    fromBean: "Cilësi në çdo fazë", fromBeanDesc: "Nga përzgjedhja e kokrrave të kafesë së gjelbër te pjekja dhe përzierja, çdo fazë e përpunimit kontrollohet me kujdes për të ruajtur cilësinë, aromën dhe shijen në çdo filxhan.",
    espressoIntro: "Përzierjet tona për espresso ndërthurin kokrra të përzgjedhura Arabica dhe Robusta me pjekje sipas traditës italiane, për një kafe me shije të ëmbël dhe aromë të pasur.",
    classicDesc: "Arabica cilësore dhe Robusta e përzgjedhur nga Amerika e Jugut. Pjekja më e gjatë jep kremë të butë dhe espresso me shije intensive.",
    aromaDesc: "Arabica cilësore dhe Robusta aziatike për aromë të pasur dhe shije të balancuar.",
    creamDesc: "Përzierje me pjekje mesatare, teksturë kremoze dhe shije të pastër në përfundim.",
    premiumLabel: "Black Premium", premiumTitle: "Espresso 100% Arabica",
    premiumP1: "Black Premium ndërthur kokrra të përzgjedhura Arabica nga Brazili dhe Afrika.",
    premiumP2: "Një espresso me shije të plotë, aromë të pasur dhe aciditet të balancuar.",
    p200Label: "Që nga viti 2016", p200Desc: "Black Premium është pjesë e gamës Galla që nga viti 2016 dhe ndërthur kokrra nga origjina të përzgjedhura në një përzierje të balancuar.",
    hospitalityLabel: "Për kafene dhe hotele", hospitalityDesc: "Shije e pasur dhe kremë e qëndrueshme për përgatitjen profesionale të espressos në kafene, restorante dhe hotele.",
    signatureProduct: "Koleksioni Galla", premiumQuoteText: "Origjinë e përzgjedhur. Shije e balancuar.",
    premiumQuote: "100% Arabica",
    capsulesLabel: "Linja e re e produkteve", capsulesTitle: "Kapsulat Galla",
    capsulesIntro: "Zbuloni kapsulat Galla dhe porositni përzierjen tuaj të preferuar online.",
    capClassic: "Kapsula Classic", capAroma: "Kapsula Aroma", capBlack: "Kapsula Black",
    capClassicDesc: "Espresso me shije të butë e të balancuar dhe kremë të lehtë, për përdorim të përditshëm.",
    capAromaDesc: "Aromë e pasur dhe shije e lehtë që mbetet pas pirjes.",
    capBlackDesc: "Espresso me shije të plotë, pjekje më të thellë dhe shije që zgjat.",
    weight: "Pesha", roast: "Pjekja", intensity: "Intensiteti", format: "Formati", formatValue: "Kuti me 10 kapsula", compatibility: "Përputhshmëria",
    inStock: "Në stok", dispatch24: "Dërgim brenda 24 orëve", vatIncluded: "TVSH e përfshirë", orderSummary: "Përmbledhja e porosisë", packsSelected: "Paketa të zgjedhura",
    noProducts: "Ende nuk ka produkte të zgjedhura.", subtotal: "Nëntotali", shipping: "Transporti", total: "Totali", free: "Falas", proceed: "Vazhdoni me porosinë",
    freeShippingNote: "Transport falas mbi EUR 35. Porositë përgatiten brenda 24 orëve.", checkoutOpens: "Checkout aktualisht hap email tek",
    aboutLabel: "Rreth nesh", aboutTitle: "Traditë që nga viti 2005",
    aboutP1: "Që nga viti 2005, Galla është e specializuar në pjekjen e kafesë dhe prodhimin e përzierjeve për espresso.",
    aboutP2: "Me përvojë shumëvjeçare në pjekjen, paketimin dhe shpërndarjen e kafesë, Galla Caffe ofron përzierje për espresso me shije dhe madhësi paketimi të ndryshme.",
    aboutP3: "Përdorim pjekjen sipas traditës italiane dhe kokrra kafeje të përzgjedhura me kujdes. Çdo përzierje piqet, përzihet dhe paketohet për të ruajtur aromën, shijen dhe freskinë.",
    aboutP4: "Përqendrohemi te cilësia e kafesë për konsum të përditshëm.",
    whatLabel: "Çfarë e dallon Galla-n", whatP1: "Pjekja sipas traditës italiane dhe kokrrat e përzgjedhura japin një espresso me shije të balancuar, aromë të qëndrueshme dhe kremë të njëtrajtshme.",
    whatP2: "Përzierjet tona janë të përshtatshme për përgatitje në shtëpi dhe shërbim profesional, me vëmendje ndaj cilësisë dhe freskisë.",
    whatP3: "Përmirësojmë përzierjet dhe paketimet përmes kontrollit të vazhdueshëm të cilësisë.",
    sending: "Duke dërguar...",
    contactSuccess: "Mesazhi u dërgua me sukses. Do t’ju kontaktojmë së shpejti.",
    contactFailed: "Mesazhi nuk mund të dërgohej.",
    contactUs: "Na kontaktoni",
    storeInformation: "Informacion për blerjet",
    shippingPolicy: "Transporti dhe dorëzimi",
    returnsPolicy: "Kthimet dhe rimbursimet",
    termsPolicy: "Kushtet e blerjes",
    privacyPolicy: "Politika e privatësisë",
    companyDetails: "Të dhënat e kompanisë",
    privacySettings: "Cilësimet e privatësisë",
 infoAddress: "Të dhënat e kontaktit", kosovo: "Kosovë", nameRequired: "Emri juaj (i detyrueshëm)", emailRequired: "Email-i juaj (i detyrueshëm)", subject: "Subjekti", message: "Mesazhi juaj", send: "Dërgo",
    footerTag: "Përzierje kafeje dhe kapsula, me pjekje sipas traditës italiane që nga viti 2005.", quickLinks: "Zbuloni", coffeeCollection: "Koleksioni i kafesë", customerService: "Shërbimi për klientët", products: "Produktet", contact: "Kontakt", rights: "Të gjitha të drejtat e rezervuara.",
  },
  mk: {
    espressoLabel: "Galla Espresso", espressoTitle: "Италијанско печење, избалансиран вкус",
    fromBean: "Квалитет во секоја фаза", fromBeanDesc: "Од изборот на зелените зрна кафе до печењето и мешањето, секоја фаза од обработката внимателно се контролира за да се зачуваат квалитетот, аромата и вкусот во секоја шолја.",
    espressoIntro: "Нашите мешавини за еспресо комбинираат избрани зрна Арабика и Робуста со печење во италијански стил за сладок вкус и богата арома.",
    classicDesc: "Квалитетна Арабика со избрана Робуста од Јужна Америка. Подолго печење за мазна крема и интензивно еспресо.",
    aromaDesc: "Квалитетна Арабика и азиска Робуста за побогата арома и балансирано тело.",
    creamDesc: "Средно печена мешавина со кремаста текстура и чист завршен вкус.",
    premiumLabel: "Black Premium", premiumTitle: "Еспресо од 100% Арабика",
    premiumP1: "Black Premium комбинира внимателно избрани зрна Арабика од Бразил и Африка.",
    premiumP2: "Еспресо со полн вкус, богата арома и избалансирана киселост.",
    p200Label: "Од 2016 година", p200Desc: "Black Premium е дел од понудата на Galla од 2016 година и комбинира зрна од избрани региони во избалансирана мешавина.",
    hospitalityLabel: "За кафулиња и хотели", hospitalityDesc: "Богат вкус и постојана крема за професионална подготовка на еспресо во кафулиња, ресторани и хотели.",
    signatureProduct: "Колекција Galla", premiumQuoteText: "Избрано потекло. Избалансиран вкус.",
    premiumQuote: "100% Арабика",
    capsulesLabel: "Нова линија производи", capsulesTitle: "Капсули Galla",
    capsulesIntro: "Откријте ги капсулите Galla и нарачајте ја вашата омилена мешавина онлајн.",
    capClassic: "Капсули Classic", capAroma: "Капсули Aroma", capBlack: "Капсули Black",
    capClassicDesc: "Еспресо со благ, избалансиран вкус и нежна крема за секојдневно уживање.",
    capAromaDesc: "Богата арома и нежен завршен вкус.",
    capBlackDesc: "Еспресо со полн вкус, потемно печење и долготраен завршен вкус.",
    weight: "Тежина", roast: "Печење", intensity: "Интензитет", format: "Формат", formatValue: "Кутија со 10 капсули", compatibility: "Компатибилност",
    inStock: "На залиха", dispatch24: "Испраќање во рок од 24 часа", vatIncluded: "Вклучен ДДВ", orderSummary: "Преглед на нарачката", packsSelected: "Избрани пакувања",
    noProducts: "Сè уште нема избрани производи.", subtotal: "Меѓузбир", shipping: "Достава", total: "Вкупно", free: "Бесплатно", proceed: "Продолжете со нарачката",
    freeShippingNote: "Бесплатна достава над EUR 35. Нарачките се подготвуваат за 24 часа.", checkoutOpens: "Checkout моментално отвора email до",
    aboutLabel: "За нас", aboutTitle: "Традиција од 2005 година",
    aboutP1: "Од 2005 година, Galla е специјализирана за печење кафе и производство на мешавини за еспресо.",
    aboutP2: "Со долгогодишно искуство во печење, пакување и дистрибуција на кафе, Galla Caffe нуди мешавини за еспресо со различни вкусови и големини на пакувања.",
    aboutP3: "Користиме печење во италијански стил и внимателно избрани зрна кафе. Секоја мешавина се пече, меша и пакува за да се зачуваат аромата, вкусот и свежината.",
    aboutP4: "Нашиот фокус е квалитетно кафе за секојдневно уживање.",
    whatLabel: "Што ја издвојува Galla", whatP1: "Печењето во италијански стил и избраните зрна даваат избалансирано еспресо со постојана арома, крема и полн вкус.",
    whatP2: "Нашите мешавини се погодни за подготовка дома и за професионална услуга, со фокус на квалитетот и свежината.",
    whatP3: "Ги подобруваме мешавините и пакувањата преку постојана контрола на квалитетот.",
    sending: "Се испраќа...",
    contactSuccess: "Пораката е успешно испратена. Ќе ве контактираме наскоро.",
    contactFailed: "Пораката не може да се испрати.",
    contactUs: "Контакт",
    storeInformation: "Информации за купување",
    shippingPolicy: "Испорака и достава",
    returnsPolicy: "Враќање и поврат на средства",
    termsPolicy: "Услови за купување",
    privacyPolicy: "Политика за приватност",
    companyDetails: "Податоци за компанијата",
    privacySettings: "Поставки за приватност",
 infoAddress: "Контакт-информации", kosovo: "Косово", nameRequired: "Вашето име (задолжително)", emailRequired: "Вашата е-пошта (задолжително)", subject: "Наслов", message: "Вашата порака", send: "Испрати",
    footerTag: "Мешавини за кафе и капсули, печени во италијански стил од 2005 година.", quickLinks: "Истражете", coffeeCollection: "Колекција кафе", customerService: "Корисничка поддршка", products: "Производи", contact: "Контакт", rights: "Сите права се задржани.",
  },
} as const;

const Index = () => {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window === "undefined") return "en";
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return saved === "sq" || saved === "mk" ? saved : "en";
  });
  const t = translations[lang];
  const [productsCarouselApi, setProductsCarouselApi] = useState<CarouselApi>();
  const [showCapsulesPopup, setShowCapsulesPopup] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [contactSubmitState, setContactSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [contactSubmitMessage, setContactSubmitMessage] = useState("");

  useEffect(() => {
    if (!productsCarouselApi) return;

    const intervalId = window.setInterval(() => {
      if (productsCarouselApi.canScrollNext()) {
        productsCarouselApi.scrollNext();
      } else {
        productsCarouselApi.scrollTo(0);
      }
    }, 3900);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [productsCarouselApi]);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setShowCapsulesPopup(true);
    }, 600);

    return () => {
      window.clearTimeout(timerId);
    };
  }, []);

  const handleLangChange = (nextLang: Language) => {
    setLang(nextLang);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLang);
    }
  };

  const products = [
    {
      id: 5,
      name: "Galla Classic",
      image: capsulesClassic,
    },
    {
      id: 6,
      name: "Galla Aroma",
      image: aromaCapsules,
    },
    {
      id: 1,
      name: "Galla Classic",
      image: classicCoffee,
    },
    {
      id: 2,
      name: "Galla Aroma",
      image: aromaCoffee,
    },
    {
      id: 3,
      name: "Galla Cream",
      image: creamCoffee,
    },
    {
      id: 4,
      name: "Galla Black Premium",
      image: blackCoffee,
    },
  ];

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setContactSubmitState("loading");
    setContactSubmitMessage("");

    try {
      await sendContact({
        name: contactForm.name,
        email: contactForm.email,
        subject: contactForm.subject || undefined,
        message: contactForm.message,
      });
      setContactSubmitState("success");
      setContactSubmitMessage(t.contactSuccess);
      setContactForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setContactSubmitState("error");
      setContactSubmitMessage(error instanceof Error ? error.message : t.contactFailed);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header lang={lang} onLangChange={handleLangChange} />
      {showCapsulesPopup && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/45 px-4 backdrop-blur-[8px]">
          <div className="relative w-full max-w-4xl rounded-2xl border border-[#e2d4c7] bg-white p-5 shadow-2xl md:p-6">
            <button
              type="button"
              onClick={() => setShowCapsulesPopup(false)}
              className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#d7c8ba] text-[#6b5b4f] transition-colors hover:bg-[#f7f2ec]"
              aria-label="Close popup"
            >
              ×
            </button>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-5 md:gap-8">
              <div className="md:col-span-2">
                <div className="flex h-full min-h-[260px] items-center justify-center rounded-xl bg-[#f4f4f4] p-4">
                  <img
                    src={capsulesPhoto}
                    alt="Galla Black and capsules"
                    className="h-full max-h-[20rem] w-full rounded-lg object-contain drop-shadow-[0_16px_24px_rgba(0,0,0,0.25)]"
                  />
                </div>
              </div>

              <div className="flex flex-col md:col-span-3 md:min-h-[290px]">
                <h2 className="font-['Playfair_Display',serif] text-3xl text-[#1f1f1f] md:text-5xl">
                  Discover Galla Capsules
                </h2>
                <p className="mt-4 max-w-[48ch] text-sm leading-7 text-[#4a4a4a] md:text-base">
                  Find your everyday espresso with Galla.
                  <br />
                  Explore Classic, Aroma, Cream, and Black - four blends to suit your taste and your coffee ritual.
                </p>

                <div className="mt-6 md:mt-auto md:flex md:justify-end">
                  <a
                    href="/capsules"
                    className="inline-flex items-center rounded-md bg-[#8B1A1A] px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#741313] md:text-sm"
                  >
                    Explore Capsules
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <section id="products" className="overflow-hidden pt-8 pb-16 md:pt-10 md:pb-20">
        <div className="w-full px-4 md:px-6">
          <Carousel
            setApi={setProductsCarouselApi}
            opts={{
              align: "start",
              loop: true,
              duration: 45,
              slidesToScroll: 1,
            }}
            className="w-full"
          >
            <CarouselContent>
              {products.map((product) => (
                <CarouselItem key={product.id} className="basis-[85%] sm:basis-[46%] md:basis-[31%] lg:basis-[24%]">
                  <div className="relative mx-auto w-full max-w-[320px]">
                    <ProductCard
                      image={product.image}
                      name={product.name}
                      category={product.id === 5 || product.id === 6 ? (lang === "sq" ? "Kapsula" : lang === "mk" ? "Капсули" : "Capsules") : "Espresso"}
                      overlay={
                        product.id === 5 || product.id === 6 ? (
                          <a
                            href="/capsules"
                            className="inline-flex items-center rounded-bl-md rounded-tr-md bg-[#9e0102] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-white ring-1 ring-white/30 transition-opacity hover:opacity-90 md:text-xs"
                          >
                            Order Now
                          </a>
                        ) : undefined
                      }
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>

      <section id="espresso" className="relative overflow-hidden bg-[#f6f2ed] py-14 text-[#1f1f1f] md:py-20">
        <div className="absolute -left-24 top-8 h-56 w-56 rounded-full bg-[#9e0102]/10 blur-3xl" />
        <div className="absolute -right-24 bottom-8 h-56 w-56 rounded-full bg-[#cfc2b7]/25 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9e0102]">{t.espressoLabel}</p>
            <h2 className="mt-2 font-serif text-4xl md:text-5xl">{t.espressoTitle}</h2>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
            <div className="relative min-h-[300px] overflow-hidden rounded-2xl lg:min-h-[420px]">
              <img src={espressoPhoto} alt="Galla espresso beans" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#fff1e3]">{t.fromBean}</p>
                  <p className="mt-2 max-w-[34ch] text-sm leading-7 text-[#fff8f1] md:text-base">
                    {t.fromBeanDesc}
                  </p>
              </div>
            </div>

            <div>
              <p className="text-sm leading-8 text-[#4a4a4a] md:text-base">{t.espressoIntro}</p>

              <div className="mt-6 space-y-5">
                <div className="border-b border-[#decec2] pb-4">
                  <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#9e0102]">Classic</p>
                  <p className="mt-2 text-sm leading-7 text-[#4f4f4f]">{t.classicDesc}</p>
                </div>
                <div className="border-b border-[#decec2] pb-4">
                  <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#9e0102]">Aroma</p>
                  <p className="mt-2 text-sm leading-7 text-[#4f4f4f]">{t.aromaDesc}</p>
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#9e0102]">Cream</p>
                  <p className="mt-2 text-sm leading-7 text-[#4f4f4f]">{t.creamDesc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="premium" className="relative overflow-hidden bg-[#f5f6f8] py-16 text-[#1f1f1f] md:py-24">
        <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_20%_20%,rgba(158,1,2,0.08),transparent_45%),radial-gradient(circle_at_85%_75%,rgba(206,213,222,0.35),transparent_40%)]" />
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
            <div className="rounded-2xl border border-[#d8dee6] bg-white p-7 md:p-9">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9e0102]">{t.premiumLabel}</p>
              <h2 className="mt-3 font-serif text-4xl leading-tight md:text-6xl">{t.premiumTitle}</h2>

              <p className="mt-6 text-base leading-8 text-[#4a4a4a] md:text-lg">{t.p200Desc}</p>
              <p className="mt-4 text-base leading-8 text-[#4a4a4a] md:text-lg">{t.premiumP1}</p>
              <p className="mt-4 text-base leading-8 text-[#4a4a4a] md:text-lg">{t.premiumP2}</p>

              <div className="mt-8">
                <article className="rounded-xl border border-[#d8dee6] bg-[#f9fafb] p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#9e0102]">{t.hospitalityLabel}</p>
                  <p className="mt-3 text-sm leading-7 text-[#4d4d4d]">{t.hospitalityDesc}</p>
                </article>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="relative overflow-hidden rounded-2xl border border-[#d8dee6] bg-white p-6">
                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#dce3ec]/35 blur-2xl" />
                <div className="absolute -left-8 bottom-0 h-28 w-28 rounded-full bg-[#9e0102]/10 blur-2xl" />
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[#9e0102]">{t.signatureProduct}</p>
                    <h3 className="mt-2 font-serif text-3xl md:text-4xl">Galla Black Premium</h3>
                  </div>
                </div>
                <img
                  src={blackCoffee}
                  alt="Galla Black Premium Coffee"
                  className="mx-auto mt-6 h-64 w-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.55)] md:h-72"
                />
              </div>

              <div className="rounded-2xl border border-[#d8dee6] bg-gradient-to-r from-white to-[#f6f8fb] p-6">
                <p className="text-sm leading-8 text-[#4b4b4b] md:text-base">{t.premiumQuoteText}</p>
                <p className="mt-4 border-t border-[#e1e7ef] pt-4 text-base font-medium text-[#7f1a1b] md:text-lg">
                  {t.premiumQuote}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="bg-[#f7f4f1] py-14 md:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9e0102]">{t.aboutLabel}</p>
            <h2 className="mt-2 font-serif text-4xl text-[#1f1f1f] md:text-5xl">{t.aboutTitle}</h2>
            <p className="mt-5 text-base leading-8 text-[#383838] md:text-lg">
              {t.aboutP1}
            </p>
            <p className="mt-4 text-base leading-8 text-[#383838] md:text-lg">
              {t.aboutP2}
            </p>
            <p className="mt-4 text-base leading-8 text-[#383838] md:text-lg">
              {t.aboutP3}
            </p>
            <p className="mt-4 text-base leading-8 text-[#383838] md:text-lg">{t.aboutP4}</p>

            <div className="mt-8">
              <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-[#9e0102]">{t.whatLabel}</h3>
              <div className="mt-4 space-y-3 text-sm leading-7 text-[#3b3b3b] md:text-base">
                <p>{t.whatP1}</p>
                <p>{t.whatP2}</p>
                <p>{t.whatP3}</p>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-5">
            <div className="col-span-2 rounded-xl bg-white p-4 shadow-sm">
              <img src={classicCoffee} alt="Galla Classic Coffee" className="mx-auto h-48 w-auto object-contain md:h-56" />
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <img src={aromaCoffee} alt="Galla Aroma Coffee" className="mx-auto h-40 w-auto object-contain md:h-48" />
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <img src={creamCoffee} alt="Galla Cream Coffee" className="mx-auto h-40 w-auto object-contain md:h-48" />
            </div>
            <div className="col-span-2 rounded-xl bg-white p-4 shadow-sm">
              <img src={blackCoffee} alt="Galla Premium Coffee" className="mx-auto h-44 w-auto object-contain md:h-52" />
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-[#9e0102] py-16 text-white md:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <h2 className="font-serif text-4xl md:text-5xl">{t.contactUs}</h2>

            <div className="mt-8 max-w-md border-t border-white/25 pt-8 md:mt-10">
              <p className="font-serif text-2xl md:text-3xl">Galla Caffe</p>
              <address className="mt-4 text-base not-italic leading-8 text-[#ffe6e2]">
                North Macedonia
              </address>

              <div className="mt-8 space-y-3 border-t border-white/25 pt-6 text-lg tabular-nums">
                <a href="tel:+38972234706" className="block w-fit underline-offset-4 transition-opacity hover:underline hover:opacity-80">+389 72 234 706</a>
                <a href="mailto:info@gallacaffe.com" className="block w-fit break-all underline-offset-4 transition-opacity hover:underline hover:opacity-80">info@gallacaffe.com</a>
              </div>
            </div>

          </div>

          <div className="rounded-2xl border border-[#d9cdc1] bg-white p-6 md:p-8">
            <form className="space-y-5" onSubmit={handleContactSubmit}>
              <div>
                <label htmlFor="contact-name" className="mb-2 block text-sm font-semibold text-[#2a2a2a]">
                  {t.nameRequired}
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(event) => setContactForm((prev) => ({ ...prev, name: event.target.value }))}
                  className="w-full rounded-md border border-[#d6c8bb] px-4 py-3 text-sm text-[#1f1f1f] outline-none transition-colors focus:border-[#9e0102]"
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="mb-2 block text-sm font-semibold text-[#2a2a2a]">
                  {t.emailRequired}
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(event) => setContactForm((prev) => ({ ...prev, email: event.target.value }))}
                  className="w-full rounded-md border border-[#d6c8bb] px-4 py-3 text-sm text-[#1f1f1f] outline-none transition-colors focus:border-[#9e0102]"
                />
              </div>

              <div>
                <label htmlFor="contact-subject" className="mb-2 block text-sm font-semibold text-[#2a2a2a]">
                  {t.subject}
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  value={contactForm.subject}
                  onChange={(event) => setContactForm((prev) => ({ ...prev, subject: event.target.value }))}
                  className="w-full rounded-md border border-[#d6c8bb] px-4 py-3 text-sm text-[#1f1f1f] outline-none transition-colors focus:border-[#9e0102]"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="mb-2 block text-sm font-semibold text-[#2a2a2a]">
                  {t.message}
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={6}
                  required
                  value={contactForm.message}
                  onChange={(event) => setContactForm((prev) => ({ ...prev, message: event.target.value }))}
                  className="w-full resize-y rounded-md border border-[#d6c8bb] px-4 py-3 text-sm text-[#1f1f1f] outline-none transition-colors focus:border-[#9e0102]"
                />
              </div>

              <button
                type="submit"
                disabled={contactSubmitState === "loading"}
                className="inline-flex items-center rounded-md bg-[#9e0102] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90"
              >
                {contactSubmitState === "loading" ? t.sending : t.send}
              </button>
              {contactSubmitState !== "idle" && (
                <p className={`text-sm ${contactSubmitState === "success" ? "text-green-700" : "text-red-700"}`}>
                  {contactSubmitMessage}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      <footer className="bg-[#9e0102] py-10 text-[#ffe6e2]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-8 px-4 md:grid-cols-[1.4fr_1fr_1fr] md:gap-10 lg:gap-16">
          <div>
            <h3 className="font-serif text-3xl leading-none">Galla Espresso</h3>
            <p className="mt-4 max-w-sm text-sm leading-7 text-[#ffd7d1]">
              {t.footerTag}
            </p>
          </div>

          <div className="md:pl-4 lg:pl-8">
            <p className="text-sm font-semibold uppercase leading-none tracking-[0.16em] text-white">{t.quickLinks}</p>
            <nav aria-label={t.quickLinks} className="mt-4 flex flex-col items-start gap-2 text-sm leading-6 text-[#ffd7d1]">
              <a href="/all-products" className="hover:underline">{t.coffeeCollection}</a>
              <a href="/capsules" className="hover:underline">{t.capsulesTitle}</a>
              <a href="#about" className="hover:underline">{t.aboutLabel}</a>
            </nav>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase leading-none tracking-[0.16em] text-white">{t.customerService}</p>
            <nav aria-label={t.customerService} className="mt-4 flex flex-col items-start gap-2 text-sm leading-6 text-[#ffd7d1]">
              <a href="/shipping" className="hover:underline">{t.shippingPolicy}</a>
              <a href="/returns" className="hover:underline">{t.returnsPolicy}</a>
              <a href="#contact" className="hover:underline">{t.contactUs}</a>
            </nav>
          </div>

        </div>
        <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-3 border-t border-[#b95a58] px-4 pt-4 text-xs text-[#ffd7d1] md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Galla Caffe. {t.rights}</p>
          <nav aria-label={t.storeInformation} className="flex flex-wrap gap-x-4 gap-y-2">
            <a href="/privacy" className="hover:underline">{t.privacyPolicy}</a>
            <a href="/terms" className="hover:underline">{t.termsPolicy}</a>
            <a href="/company-details" className="hover:underline">{t.companyDetails}</a>
            <button type="button" onClick={() => window.dispatchEvent(new Event("galla:open-consent"))} className="hover:underline">{t.privacySettings}</button>
          </nav>

        </div>
      </footer>
    </div>
  );
};

export default Index;
