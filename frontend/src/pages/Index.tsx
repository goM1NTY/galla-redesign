import { FormEvent, useEffect, useState } from "react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { sendContact } from "@/lib/api";
import classicCoffee from "@/assets/classic-coffee.png";
import aromaCoffee from "@/assets/aroma-coffee.png";
import blackCoffee from "@/assets/black-coffee.png";
import creamCoffee from "@/assets/cream-coffee.png";
import espressoPhoto from "@/assets/5.jpeg";
import capsulesClassic from "@/assets/capsules_classic.png";

type Language = "en" | "sq" | "mk";

const translations = {
  en: {
    espressoLabel: "Galla Espresso",
    espressoTitle: "Italian Roast, Balanced Character",
    fromBean: "From Bean To Cup",
    fromBeanDesc: "Carefully selected green beans, precision roasting, and controlled blending create a consistent cup.",
    espressoIntro:
      "Espresso is a wonderful blend of Arabica and Robusta coffees with controlled quality and Italian-style roasting. With our expertise and technique in coffee production, the result is a sweet, aromatic, and deeply enjoyable espresso experience.",
    classicDesc:
      "High-quality Arabica with selected Robusta from South America. Longer roast for smooth crema and intense espresso.",
    aromaDesc: "High-quality Arabica and Asiatic Robusta crafted for richer aroma and balanced body.",
    creamDesc: "Smooth middle-roast blend with creamy texture and clean finish for daily enjoyment.",
    premiumLabel: "Black Premium",
    premiumTitle: "Deep Character. Elite Blend.",
    premiumP1: "This incredible mixture is made from high-quality, carefully selected beans: 100% Arabica from the plains of Brazil and Africa.",
    premiumP2: "The combination of bean origin delivers a unique experience with strong flavor, complete body, and a balanced acidity profile.",
    p200Label: "200 Premium",
    p200Desc: "Since 2016, our distribution network includes Black Premium espresso, crafted from the finest coffee varieties in carefully balanced proportions.",
    hospitalityLabel: "For Hospitality",
    hospitalityDesc: "With peak flavor and creamy consistency, this premium blend is designed for hotels and exclusive catering facilities that demand high-quality espresso service.",
    signatureProduct: "Signature Product",
    premiumQuoteText: "We believe that in a short period of time, hoteliers and exclusive catering facilities in Macedonia and other countries will clearly recognize the difference of this product compared to competitors.",
    premiumQuote: "Once you try this coffee, you become its fan forever.",
    capsulesLabel: "New Product Line",
    capsulesTitle: "Galla Capsules",
    capsulesIntro: "Capsules are now part of the Galla portfolio. Choose Classic, Aroma, or Black and place an order with a standard checkout-style summary.",
    capClassic: "Capsules Classic",
    capAroma: "Capsules Aroma",
    capBlack: "Capsules Black",
    capClassicDesc: "Balanced and smooth cup with soft crema, designed for everyday espresso moments.",
    capAromaDesc: "Aromatic profile with richer fragrance and elegant aftertaste for specialty coffee lovers.",
    capBlackDesc: "Strong body and deeper roast character with long finish and bold espresso expression.",
    weight: "Weight",
    roast: "Roast",
    intensity: "Intensity",
    format: "Format",
    formatValue: "Box of 10 capsules",
    compatibility: "Compatibility",
    inStock: "In stock",
    dispatch24: "Dispatch in 24h",
    vatIncluded: "VAT included",
    orderSummary: "Order Summary",
    packsSelected: "Packs selected",
    noProducts: "No products selected yet.",
    subtotal: "Subtotal",
    shipping: "Shipping",
    total: "Total",
    free: "Free",
    proceed: "Proceed To Order",
    freeShippingNote: "Free shipping above EUR 35. Orders are prepared within 24 hours.",
    checkoutOpens: "Checkout currently opens email to",
    aboutLabel: "About Us",
    aboutTitle: "Crafted Since 2005",
    aboutP1: "Galla is an Italian-domestic investment established in 2005 in Tetovo. Since then, it has grown into a successful business in the local and regional market.",
    aboutP2: "As a factory for roasting, packaging, and distribution of coffee, with many years of tradition in this industry, Galla Kaffe offers espresso coffee in different flavors and packaging formats.",
    aboutP3: "The quality of Galla Kaffe products is based on the Italian style of roasting and on using the highest quality coffee beans in the world, carefully selected, roasted, blended, and packed to preserve flavor, taste, and freshness.",
    aboutP4: "Our aim is to provide inspiration with every cup, and we believe there is nothing better than a warm cup of Galla Espresso.",
    whatLabel: "What Makes Galla Different",
    whatP1: "Italian-style roasting methods combined with carefully selected beans deliver a balanced cup with consistency in aroma, crema, and body.",
    whatP2: "Every blend is designed for daily coffee moments, from home brewing to professional service, while maintaining premium quality and freshness.",
    whatP3: "Through constant innovation and strict quality control, Galla continues to expand flavors, packaging, and coffee experiences for modern consumers.",
    promiseLabel: "Our Promise",
    promiseText: "From sourcing to final packaging, each step is guided by one promise: dependable quality in every cup. Galla works to bring the warmth of true espresso culture to everyday life with products consumers can trust and enjoy every day.",
    mission: "Mission",
    missionText: "Our mission is to meet the needs, tastes, and desires of consumers through quality, experienced people, modern technology, and continuous product innovation.",
    vision: "Vision",
    visionText: "Our vision is for Galla Kaffe to become a recognized brand in our country and across Europe by delivering quality and value that belong at every table.",
    contactUs: "Contact Us",
    infoAddress: "Information & Address",
    kosovo: "Kosovo",
    nameRequired: "Your Name (required)",
    emailRequired: "Your Email (required)",
    subject: "Subject",
    message: "Your Message",
    send: "Send",
    footerTag: "Crafted coffee blends and capsules with Italian roasting character since 2005.",
    quickLinks: "Quick Links",
    products: "Products",
    contact: "Contact",
    rights: "All rights reserved.",
  },
  sq: {
    espressoLabel: "Galla Espresso", espressoTitle: "Pjekje Italiane, Karakter i Balancuar",
    fromBean: "Nga Kokrra te Filxhani", fromBeanDesc: "Kokrra të përzgjedhura, pjekje precize dhe përzierje e kontrolluar krijojnë filxhan të qëndrueshëm.",
    espressoIntro: "Espresso është një përzierje e mrekullueshme e Arabica dhe Robusta me cilësi të kontrolluar dhe stil italian pjekjeje. Me ekspertizën tonë, rezultati është një espresso i ëmbël, aromatik dhe shumë i shijshëm.",
    classicDesc: "Arabica cilësore me Robusta të përzgjedhur nga Amerika e Jugut. Pjekje më e gjatë për kremë të butë dhe espresso intensiv.",
    aromaDesc: "Arabica cilësore dhe Robusta aziatike për aromë më të pasur dhe trup të balancuar.",
    creamDesc: "Përzierje me pjekje mesatare, teksturë kremoze dhe fund të pastër për përdorim të përditshëm.",
    premiumLabel: "Black Premium", premiumTitle: "Karakter i Thellë. Përzierje Elite.",
    premiumP1: "Kjo përzierje e jashtëzakonshme përbëhet nga kokrra të përzgjedhura me cilësi të lartë: 100% Arabica nga Brazili dhe Afrika.",
    premiumP2: "Origjina e kombinuar e kokrrave garanton përvojë unike, shije të fortë dhe aciditet të balancuar.",
    p200Label: "200 Premium", p200Desc: "Që nga viti 2016, rrjeti ynë përfshin Black Premium espresso, i bërë nga varietetet më të mira të kafesë në raport perfekt.",
    hospitalityLabel: "Për Hoteleri", hospitalityDesc: "Me cilësi të lartë, shije kulmore dhe konsistencë kremoze, ky blend synon hotelerinë dhe catering-un ekskluziv.",
    signatureProduct: "Produkt Kryesor", premiumQuoteText: "Besojmë se në kohë të shkurtër hoteleria dhe catering-u ekskluziv në Maqedoni dhe vende të tjera do ta vërejnë diferencën ndaj konkurrencës.",
    premiumQuote: "Sapo ta provoni këtë kafe, do të bëheni fans përherë.",
    capsulesLabel: "Linja e Re e Produkteve", capsulesTitle: "Kapsulat Galla",
    capsulesIntro: "Kapsulat tashmë janë pjesë e portofolit Galla. Zgjidh Classic, Aroma ose Black dhe porosit me përmbledhje standarde checkout.",
    capClassic: "Kapsula Classic", capAroma: "Kapsula Aroma", capBlack: "Kapsula Black",
    capClassicDesc: "Filxhan i balancuar dhe i butë me kremë të lehtë, ideal për espresso të përditshme.",
    capAromaDesc: "Profil aromatik më i pasur dhe shije elegante për adhuruesit e kafesë.",
    capBlackDesc: "Trup i fortë dhe pjekje më e thellë me përfundim të gjatë.",
    weight: "Pesha", roast: "Pjekja", intensity: "Intensiteti", format: "Formati", formatValue: "Kuti me 10 kapsula", compatibility: "Përputhshmëria",
    inStock: "Në stok", dispatch24: "Dërgesa brenda 24h", vatIncluded: "TVSH e përfshirë", orderSummary: "Përmbledhja e Porosisë", packsSelected: "Paketa të zgjedhura",
    noProducts: "Ende nuk ka produkte të zgjedhura.", subtotal: "Nëntotali", shipping: "Transporti", total: "Totali", free: "Falas", proceed: "Vazhdo me Porosinë",
    freeShippingNote: "Transport falas mbi EUR 35. Porositë përgatiten brenda 24 orëve.", checkoutOpens: "Checkout aktualisht hap email tek",
    aboutLabel: "Rreth Nesh", aboutTitle: "Artizanale që nga 2005",
    aboutP1: "Galla është investim italo-vendor i themeluar në vitin 2005 në Tetovë dhe që atëherë ka qenë biznes i suksesshëm në tregun lokal dhe rajonal.",
    aboutP2: "Si fabrikë për pjekje, paketim dhe distribuim të kafesë, me traditë shumëvjeçare, Galla Kaffe ofron espresso me shije dhe paketime të ndryshme.",
    aboutP3: "Cilësia e produkteve Galla bazohet në stilin italian të pjekjes dhe përdorimin e kokrrave më cilësore në botë, të përzgjedhura, pjekura, përziera dhe paketuara me kujdes.",
    aboutP4: "Qëllimi ynë është të sjellim frymëzim me çdo filxhan; besojmë se nuk ka asgjë më të mirë se një filxhan i ngrohtë Galla Espresso.",
    whatLabel: "Çfarë e Bën Galla Ndryshe", whatP1: "Metodat italiane të pjekjes dhe kokrrat e përzgjedhura sjellin filxhan të balancuar me aromë dhe trup të qëndrueshëm.",
    whatP2: "Çdo blend është krijuar për momentet e përditshme të kafesë, duke ruajtur cilësi dhe freski premium.",
    whatP3: "Me inovacion të vazhdueshëm dhe kontroll strikt, Galla zgjeron shijet dhe përvojën e kafesë.",
    promiseLabel: "Premtimi Ynë", promiseText: "Nga përzgjedhja deri te paketimi final, çdo hap udhëhiqet nga një premtim: cilësi e qëndrueshme në çdo filxhan.",
    mission: "Misioni", missionText: "Misioni ynë është të përmbushim nevojat, shijet dhe dëshirat e konsumatorëve përmes cilësisë, stafit me përvojë, teknologjisë moderne dhe inovacionit të vazhdueshëm.",
    vision: "Vizioni", visionText: "Vizioni ynë është që Galla Kaffe të bëhet markë e njohur në vend dhe në Evropë duke ofruar cilësi dhe vlerë.",
    contactUs: "Na Kontaktoni", infoAddress: "Informacion & Adresë", kosovo: "Kosovë", nameRequired: "Emri Juaj (i detyrueshëm)", emailRequired: "Email-i Juaj (i detyrueshëm)", subject: "Subjekti", message: "Mesazhi Juaj", send: "Dërgo",
    footerTag: "Përzierje kafeje dhe kapsula me karakter italian pjekjeje që nga viti 2005.", quickLinks: "Lidhje të Shpejta", products: "Produktet", contact: "Kontakt", rights: "Të gjitha të drejtat e rezervuara.",
  },
  mk: {
    espressoLabel: "Galla Espresso", espressoTitle: "Италијанско Печење, Балансиран Карактер",
    fromBean: "Од Зрно До Шолја", fromBeanDesc: "Внимателно избрани зрна, прецизно печење и контролирано мешање создаваат конзистентна шолја.",
    espressoIntro: "Еспресото е одличен спој на Арабика и Робуста со контролиран квалитет и италијански стил на печење. Резултатот е сладок, ароматичен и многу вкусен еспресо.",
    classicDesc: "Квалитетна Арабика со избрана Робуста од Јужна Америка. Подолго печење за мазна крема и интензивно еспресо.",
    aromaDesc: "Квалитетна Арабика и азиска Робуста за побогата арома и балансирано тело.",
    creamDesc: "Средно печен бленд со кремаста текстура и чист финиш за секојдневно уживање.",
    premiumLabel: "Black Premium", premiumTitle: "Длабок Карактер. Елитен Бленд.",
    premiumP1: "Оваа извонредна мешавина е од внимателно избрани зрна: 100% Арабика од Бразил и Африка.",
    premiumP2: "Комбинацијата на потекло гарантира уникатно искуство, силен вкус и балансирана киселост.",
    p200Label: "200 Premium", p200Desc: "Од 2016 година, во дистрибуција е Black Premium еспресо, направено од најфини сорти во совршен сооднос.",
    hospitalityLabel: "За Хотелиерство", hospitalityDesc: "Со врвен вкус и кремаста конзистентност, овој премиум бленд е наменет за хотели и ексклузивен кетеринг.",
    signatureProduct: "Главен Производ", premiumQuoteText: "Веруваме дека за кратко време хотелите и ексклузивните угостителски објекти во Македонија и други земји ќе ја препознаат разликата.",
    premiumQuote: "Кога ќе го пробате, ќе станете негов фан засекогаш.",
    capsulesLabel: "Нова Линија", capsulesTitle: "Galla Капсули",
    capsulesIntro: "Капсулите се нов дел од Galla. Избери Classic, Aroma или Black и нарачај со стандардна checkout сума.",
    capClassic: "Капсули Classic", capAroma: "Капсули Aroma", capBlack: "Капсули Black",
    capClassicDesc: "Балансирана и мазна шолја со нежна крема за секојдневно еспресо.",
    capAromaDesc: "Ароматичен профил со побогат мирис и елегантен вкус.",
    capBlackDesc: "Силно тело и подлабоко печење со долг финиш.",
    weight: "Тежина", roast: "Печење", intensity: "Интензитет", format: "Формат", formatValue: "Кутија со 10 капсули", compatibility: "Компатибилност",
    inStock: "На залиха", dispatch24: "Испорака за 24ч", vatIncluded: "ДДВ вклучен", orderSummary: "Резиме на Нарачка", packsSelected: "Избрани пакувања",
    noProducts: "Сè уште нема избрани производи.", subtotal: "Меѓузбир", shipping: "Достава", total: "Вкупно", free: "Бесплатно", proceed: "Продолжи со Нарачка",
    freeShippingNote: "Бесплатна достава над EUR 35. Нарачките се подготвуваат за 24 часа.", checkoutOpens: "Checkout моментално отвора email до",
    aboutLabel: "За Нас", aboutTitle: "Создадено Од 2005",
    aboutP1: "Galla е италијанско-домашна инвестиција основана во 2005 година во Тетово и оттогаш успешно работи на локалниот и регионалниот пазар.",
    aboutP2: "Како фабрика за печење, пакување и дистрибуција, со долгогодишна традиција, Galla Kaffe нуди еспресо со различни вкусови и пакувања.",
    aboutP3: "Квалитетот е базиран на италијански стил на печење и употреба на најквалитетни зрна, внимателно избрани, печени, мешани и пакувани.",
    aboutP4: "Нашата цел е инспирација со секоја шолја; веруваме дека нема ништо подобро од топла шолја Galla Espresso.",
    whatLabel: "Што Ја Прави Galla Поинаква", whatP1: "Италијански методи на печење и избрани зрна даваат балансирана шолја со конзистентна арома.",
    whatP2: "Секој бленд е дизајниран за секојдневни кафе моменти со премиум квалитет и свежина.",
    whatP3: "Со постојана иновација и контрола на квалитет, Galla го проширува своето портфолио.",
    promiseLabel: "Наше Ветување", promiseText: "Од избор до финално пакување, секој чекор е воден од едно ветување: сигурен квалитет во секоја шолја.",
    mission: "Мисија", missionText: "Нашата мисија е да ги задоволиме потребите, вкусовите и желбите на потрошувачите преку квалитет, искусен кадар, модерна технологија и постојана иновација.",
    vision: "Визија", visionText: "Визијата е Galla Kaffe да стане препознатлив бренд во земјата и Европа со квалитет и вредност.",
    contactUs: "Контакт", infoAddress: "Информации и Адреса", kosovo: "Косово", nameRequired: "Ваше Име (задолжително)", emailRequired: "Ваш Email (задолжително)", subject: "Наслов", message: "Вашата Порака", send: "Испрати",
    footerTag: "Кафе мешавини и капсули со италијански карактер на печење од 2005.", quickLinks: "Брзи Линкови", products: "Производи", contact: "Контакт", rights: "Сите права се задржани.",
  },
} as const;

const Index = () => {
  const [lang, setLang] = useState<Language>("en");
  const t = translations[lang];
  const [productsCarouselApi, setProductsCarouselApi] = useState<CarouselApi>();
  const [activeProductIndex, setActiveProductIndex] = useState(0);
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

    const onSelect = () => {
      const visibleSlides = productsCarouselApi.slidesInView();
      const middleVisibleIndex = visibleSlides[Math.floor(visibleSlides.length / 2)];
      setActiveProductIndex(
        typeof middleVisibleIndex === "number" ? middleVisibleIndex : productsCarouselApi.selectedScrollSnap(),
      );
    };
    onSelect();
    productsCarouselApi.on("select", onSelect);
    productsCarouselApi.on("reInit", onSelect);

    const intervalId = window.setInterval(() => {
      if (productsCarouselApi.canScrollNext()) {
        productsCarouselApi.scrollNext();
      } else {
        productsCarouselApi.scrollTo(0);
      }
    }, 4800);

    return () => {
      productsCarouselApi.off("select", onSelect);
      productsCarouselApi.off("reInit", onSelect);
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

  const products = [
    {
      id: 5,
      name: "GALLA CAPSULES CLASSIC",
      image: capsulesClassic,
      imageClassName: "scale-105 md:scale-110 brightness-110 contrast-110",
    },
    {
      id: 1,
      name: "GALLA CLASSIC",
      image: classicCoffee,
    },
    {
      id: 2,
      name: "GALLA AROMA",
      image: aromaCoffee,
    },
    {
      id: 3,
      name: "GALLA CREAM",
      image: creamCoffee,
    },
    {
      id: 4,
      name: "GALLA BLACK PREMIUM",
      image: blackCoffee,
      imageClassName: "scale-56 md:scale-66",
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
      setContactSubmitMessage("Message sent successfully. We will contact you shortly.");
      setContactForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setContactSubmitState("error");
      setContactSubmitMessage(error instanceof Error ? error.message : "Failed to send message.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header lang={lang} onLangChange={setLang} />
      {showCapsulesPopup && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/35 px-4">
          <div className="relative w-full max-w-6xl rounded-2xl border border-[#e2d4c7] bg-white p-6 shadow-2xl md:p-8">
            <button
              type="button"
              onClick={() => setShowCapsulesPopup(false)}
              className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#d7c8ba] text-[#6b5b4f] transition-colors hover:bg-[#f7f2ec]"
              aria-label="Close popup"
            >
              ×
            </button>

            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9e0102]">{t.capsulesLabel}</p>
            <h2 className="mt-2 font-serif text-3xl text-[#1f1f1f] md:text-5xl">{t.capsulesTitle}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#4a4a4a] md:text-base">
              {t.capsulesIntro}
            </p>

            <div className="relative mt-5 flex items-center justify-end md:mt-3">
              <svg
                viewBox="0 0 420 110"
                className="pointer-events-none absolute -top-14 right-28 hidden h-24 w-[24rem] md:block"
                aria-hidden="true"
              >
                <path
                  d="M6 22 C 130 2, 220 102, 395 86"
                  fill="none"
                  stroke="#b95a58"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                />
                <path d="M386 78 L398 86 L384 92" fill="none" stroke="#b95a58" strokeWidth="2" />
              </svg>

              <a
                href="/capsules"
                className="inline-flex items-center rounded-md bg-[#9e0102] px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90 md:text-sm"
              >
                Explore Capsules
              </a>
            </div>
          </div>
        </div>
      )}

      <section id="products" className="pt-8 pb-16 md:pt-10 md:pb-20">
        <div className="mx-auto max-w-7xl px-4">
          <Carousel
            setApi={setProductsCarouselApi}
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {products.map((product, index) => (
                <CarouselItem key={product.id} className="basis-full md:basis-1/2 lg:basis-1/3">
                  <div className="relative mx-auto w-fit">
                    <ProductCard
                      image={product.image}
                      name={product.name}
                      imageClassName={`${product.imageClassName || ""} transition-transform duration-500 ${
                        index === activeProductIndex ? "scale-104 md:scale-108" : "scale-97 md:scale-100"
                      }`}
                      overlay={
                        product.id === 5 ? (
                          <a
                            href="/capsules"
                            className="inline-flex items-center rounded-bl-md rounded-tr-md bg-[#9e0102] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-white shadow-lg ring-1 ring-white/30 animate-pulse transition-opacity hover:opacity-90 md:text-xs"
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

              <p className="mt-6 text-base leading-8 text-[#4a4a4a] md:text-lg">{t.premiumP1}</p>
              <p className="mt-4 text-base leading-8 text-[#4a4a4a] md:text-lg">{t.premiumP2}</p>

              <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                <article className="rounded-xl border border-[#d8dee6] bg-[#f9fafb] p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#9e0102]">{t.p200Label}</p>
                  <p className="mt-3 text-sm leading-7 text-[#4d4d4d]">{t.p200Desc}</p>
                </article>
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
                  <p className="text-right text-5xl font-black leading-none text-[#d7dee7] md:text-6xl">200</p>
                </div>
                <img
                  src={blackCoffee}
                  alt="Galla Black Premium Coffee"
                  className="mx-auto mt-6 h-64 w-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.55)] md:h-72"
                />
              </div>

              <div className="rounded-2xl border border-[#d8dee6] bg-gradient-to-r from-white to-[#f6f8fb] p-6">
                <p className="text-sm leading-8 text-[#4b4b4b] md:text-base">{t.premiumQuoteText}</p>
                <p className="mt-4 border-t border-[#e1e7ef] pt-4 text-base font-semibold italic text-[#7f1a1b] md:text-lg">
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

            <div className="mt-5">
              <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-[#9e0102]">{t.promiseLabel}</h3>
              <p className="mt-3 text-sm leading-7 text-[#3b3b3b] md:text-base">{t.promiseText}</p>
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
            <div className="col-span-2 rounded-xl bg-white p-6 shadow-sm">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-[#9e0102]">{t.mission}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#3b3b3b] md:text-base">{t.missionText}</p>
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-[#9e0102]">{t.vision}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#3b3b3b] md:text-base">{t.visionText}</p>
                </div>
              </div>
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
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#ffd7d1]">{t.contactUs}</p>
            <h2 className="mt-2 font-serif text-4xl md:text-5xl">{t.infoAddress}</h2>

            <div className="mt-6 rounded-xl border border-[#d9cdc1] bg-white p-6">
              <p className="font-semibold text-[#9e0102]">Galla Caffe</p>
              <p className="mt-2 text-sm leading-7 text-[#383838] md:text-base">
                Ilindenska 160
                <br />
                Tetovo, Macedonia
              </p>

              <div className="mt-5 space-y-1 text-sm md:text-base">
                <p>+389 44 333 375</p>
                <p>+389 71 224 557</p>
                <p>+385 98 191 2003</p>
              </div>

              <p className="mt-5 font-semibold text-[#9e0102]">minetamexhiti01@gmail.com</p>
            </div>

            <div className="mt-4 rounded-xl border border-[#d9cdc1] bg-white p-6">
              <p className="font-semibold text-[#9e0102]">{t.kosovo}</p>
              <p className="mt-2 font-medium">NPSH Orient</p>
              <p className="mt-1 text-sm leading-7 text-[#383838] md:text-base">Rr. Rexhep Bislimi, FERIZAJ</p>

              <div className="mt-4 space-y-1 text-sm md:text-base">
                <p>044 817 074</p>
                <p>045 677 736</p>
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
                {contactSubmitState === "loading" ? "Sending..." : t.send}
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
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 md:grid-cols-3">
          <div>
            <h3 className="font-serif text-3xl">Galla Espresso</h3>
            <p className="mt-2 text-sm leading-7 text-[#ffd7d1]">
              {t.footerTag}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white">{t.quickLinks}</p>
            <div className="mt-3 space-y-2 text-sm">
              <p><a href="#products" className="hover:underline">{t.products}</a></p>
              <p><a href="#espresso" className="hover:underline">{t.espressoLabel}</a></p>
              <p><a href="/capsules" className="hover:underline">{t.capsulesTitle}</a></p>
              <p><a href="#premium" className="hover:underline">{t.premiumLabel}</a></p>
              <p><a href="#contact" className="hover:underline">{t.contact}</a></p>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white">{t.contact}</p>
            <div className="mt-3 space-y-1 text-sm text-[#ffd7d1]">
              <p>Ilindenska 160, Tetovo, Macedonia</p>
              <p>+389 44 333 375</p>
              <p>+389 71 224 557</p>
              <p>minetamexhiti01@gmail.com</p>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-7xl border-t border-[#b95a58] px-4 pt-4 text-xs text-[#ffd7d1]">
          © {new Date().getFullYear()} Galla Caffe. {t.rights}
        </div>
      </footer>
    </div>
  );
};

export default Index;
