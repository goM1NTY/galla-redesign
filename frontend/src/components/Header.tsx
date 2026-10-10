import gallaLogo from "@/assets/galla-logo.webp";

type Language = "en" | "sq" | "mk";

interface HeaderProps {
  lang: Language;
  onLangChange: (lang: Language) => void;
}

const Header = ({ lang, onLangChange }: HeaderProps) => {
  const navItems = {
    en: [
      { label: "Collections", href: "/all-products" },
      { label: "About Us", href: "#about" },
      { label: "Capsules", href: "/capsules" },
      { label: "Contact", href: "#contact" },
    ],
    sq: [
      { label: "Koleksioni", href: "/all-products" },
      { label: "Rreth Nesh", href: "#about" },
      { label: "Kapsula", href: "/capsules" },
      { label: "Kontakt", href: "#contact" },
    ],
    mk: [
      { label: "Колекција", href: "/all-products" },
      { label: "За Нас", href: "#about" },
      { label: "Капсули", href: "/capsules" },
      { label: "Контакт", href: "#contact" },
    ],
  };

  return (
    <header className="relative bg-[#9e0102] text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 pb-1.5 pt-3.5 md:pt-4">
        <div className="absolute right-4 top-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.1em] md:right-6 md:text-xs">
          <button
            type="button"
            onClick={() => onLangChange("en")}
            className={`rounded px-2 py-1 ${lang === "en" ? "bg-white text-[#9e0102]" : "bg-white/20 text-white"}`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => onLangChange("sq")}
            className={`rounded px-2 py-1 ${lang === "sq" ? "bg-white text-[#9e0102]" : "bg-white/20 text-white"}`}
          >
            AL
          </button>
          <button
            type="button"
            onClick={() => onLangChange("mk")}
            className={`rounded px-2 py-1 ${lang === "mk" ? "bg-white text-[#9e0102]" : "bg-white/20 text-white"}`}
          >
            MK
          </button>
        </div>
        <div className="text-center">
          <img
            src={gallaLogo}
            alt="Galla Espresso Italiano"
            style={{ filter: "url(/logo-background.svg#match-header)" }}
            className="mx-auto h-auto w-full max-w-[265px] md:max-w-[325px]"
          />
        </div>

        <nav className="mt-2.5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] font-semibold uppercase tracking-wide md:text-[13px]">
          {navItems[lang].map((item) => (
            <a key={item.label} href={item.href} className="transition-opacity hover:opacity-80">
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
