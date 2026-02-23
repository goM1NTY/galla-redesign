import { useEffect, useState } from "react";
import gallaLogo from "@/assets/Gemini_Generated_Image_i2ijc5i2ijc5i2ij.png";

type Language = "en" | "sq" | "mk";

interface HeaderProps {
  lang: Language;
  onLangChange: (lang: Language) => void;
}

const Header = ({ lang, onLangChange }: HeaderProps) => {
  const [logoSrc, setLogoSrc] = useState(gallaLogo);
  const navItems = {
    en: [
      { label: "All Products", href: "/all-products" },
      { label: "About Us", href: "#about" },
      { label: "Galla Espresso", href: "#espresso" },
      { label: "Capsules", href: "/capsules" },
      { label: "Black Premium", href: "#premium" },
      { label: "Contact", href: "#contact" },
    ],
    sq: [
      { label: "Të Gjitha Produktet", href: "/all-products" },
      { label: "Rreth Nesh", href: "#about" },
      { label: "Galla Espresso", href: "#espresso" },
      { label: "Kapsula", href: "/capsules" },
      { label: "Black Premium", href: "#premium" },
      { label: "Kontakt", href: "#contact" },
    ],
    mk: [
      { label: "Сите Производи", href: "/all-products" },
      { label: "За Нас", href: "#about" },
      { label: "Galla Espresso", href: "#espresso" },
      { label: "Капсули", href: "/capsules" },
      { label: "Black Premium", href: "#premium" },
      { label: "Контакт", href: "#contact" },
    ],
  };

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = gallaLogo;

    img.onload = () => {
      const maxWidth = 1200;
      const scale = img.width > maxWidth ? maxWidth / img.width : 1;
      const width = Math.max(1, Math.round(img.width * scale));
      const height = Math.max(1, Math.round(img.height * scale));

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
    <header className="bg-[#9e0102] text-white">
      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 pb-2 pt-4 md:pt-5">
        <div className="absolute right-4 top-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.1em] md:text-xs">
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
            src={logoSrc}
            alt="Galla Espresso Italiano"
            className="mx-auto h-auto w-full max-w-[240px] md:max-w-[290px]"
          />
        </div>

        <nav className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[10px] font-semibold uppercase tracking-wide md:text-xs">
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
