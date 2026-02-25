import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import gallaLogo from "@/assets/Gemini_Generated_Image_i2ijc5i2ijc5i2ij.png";

type Language = "en" | "sq" | "mk";

interface CompactHeaderProps {
  cartCount?: number;
  cartHref?: string;
  lang?: Language;
  onLangChange?: (lang: Language) => void;
}

const CompactHeader = ({ cartCount = 0, cartHref, lang = "en", onLangChange }: CompactHeaderProps) => {
  const [logoSrc, setLogoSrc] = useState(gallaLogo);
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

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = gallaLogo;

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
      const threshold = 48;

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
      setLogoSrc(canvas.toDataURL("image/png"));
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-[#c14546] bg-[#9e0102] text-white">
      <div className="flex items-center justify-between gap-4 py-1.5 pl-5 pr-4">
        <Link to="/" className="inline-flex items-center self-start">
          <img src={logoSrc} alt="Galla Espresso Italiano" className="h-14 w-auto object-contain md:h-16" />
        </Link>

        <div className="flex flex-col items-end gap-1">
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
          <nav className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 text-xs font-semibold uppercase tracking-[0.14em] md:text-[13px]">
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
