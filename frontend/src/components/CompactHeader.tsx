import LogoBackgroundFilter from "./LogoBackgroundFilter";
import { Link } from "react-router-dom";
import gallaLogo from "@/assets/galla-logo.webp";

type Language = "en" | "sq" | "mk";

interface CompactHeaderProps {
  cartCount?: number;
  cartHref?: string;
  lang?: Language;
  onLangChange?: (lang: Language) => void;
}

const CompactHeader = ({ cartCount = 0, cartHref, lang = "en", onLangChange }: CompactHeaderProps) => {
  const navItems = {
    en: {
      collections: "Collections",
      capsules: "Capsules",
      about: "About Us",
      contact: "Contact",
      cart: "Cart",
    },
    sq: {
      collections: "Koleksioni",
      capsules: "Kapsula",
      about: "Rreth Nesh",
      contact: "Kontakt",
      cart: "Shporta",
    },
    mk: {
      collections: "Колекција",
      capsules: "Капсули",
      about: "За Нас",
      contact: "Контакт",
      cart: "Кошничка",
    },
  } as const;

  return (
    <header className="sticky top-0 z-40 border-b border-[#c14546] bg-[#9e0102] text-white">
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 sm:flex-nowrap sm:gap-4 sm:px-5">
        <Link to="/" className="relative inline-flex h-14 w-24 shrink-0 items-center justify-center overflow-hidden md:h-16 md:w-28">
          <LogoBackgroundFilter />
          <img src={gallaLogo} alt="Galla Espresso Italiano" style={{ filter: "url(#match-header)" }} className="absolute h-24 w-auto max-w-none object-contain md:h-28" />
        </Link>

        <div className="flex min-w-0 flex-1 flex-col items-end gap-2">
          {onLangChange && (
            <div className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.08em] md:text-[10px]">
              <button
                type="button"
                onClick={() => onLangChange("en")}
                className={`rounded-sm px-1.5 py-0.5 ${lang === "en" ? "bg-white text-[#9e0102]" : "bg-white/20 text-white"}`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => onLangChange("sq")}
                className={`rounded-sm px-1.5 py-0.5 ${lang === "sq" ? "bg-white text-[#9e0102]" : "bg-white/20 text-white"}`}
              >
                AL
              </button>
              <button
                type="button"
                onClick={() => onLangChange("mk")}
                className={`rounded-sm px-1.5 py-0.5 ${lang === "mk" ? "bg-white text-[#9e0102]" : "bg-white/20 text-white"}`}
              >
                MK
              </button>
            </div>
          )}
          <nav className="flex flex-wrap items-center justify-end gap-x-2 gap-y-2 text-[10px] sm:gap-x-4 sm:text-xs font-semibold uppercase tracking-[0.06em] md:text-[13px]">
            <Link to="/all-products" className="transition-opacity hover:opacity-80">{navItems[lang].collections}</Link>
            <Link to="/capsules" className="transition-opacity hover:opacity-80">{navItems[lang].capsules}</Link>
            <Link to="/#about" className="transition-opacity hover:opacity-80">{navItems[lang].about}</Link>
            <Link to="/#contact" className="transition-opacity hover:opacity-80">{navItems[lang].contact}</Link>
          {cartCount > 0 && cartHref && (
            <a
              href={cartHref}
              className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/10 px-2.5 py-1 text-[11px] font-bold tracking-[0.06em] text-white transition-opacity hover:opacity-85"
            >
              {navItems[lang].cart}
              <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-[10px] leading-5 text-[#9e0102]">
                {cartCount}
              </span>
            </a>
          )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default CompactHeader;
