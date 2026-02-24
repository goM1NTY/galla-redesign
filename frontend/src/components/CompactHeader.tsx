import { Link } from "react-router-dom";
import gallaLogo from "@/assets/Gemini_Generated_Image_i2ijc5i2ijc5i2ij.png";

interface CompactHeaderProps {
  cartCount?: number;
  cartHref?: string;
}

const CompactHeader = ({ cartCount = 0, cartHref }: CompactHeaderProps) => {
  return (
    <header className="sticky top-0 z-40 border-b border-[#c14546] bg-[#9e0102] text-white">
      <div className="flex items-center justify-between gap-4 pl-5 pr-4 py-1.5">
        <Link to="/" className="inline-flex items-center self-start">
          <img src={gallaLogo} alt="Galla Espresso Italiano" className="h-14 w-auto object-contain md:h-16" />
        </Link>

        <nav className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 text-xs font-semibold uppercase tracking-[0.08em] md:text-[13px]">
          <Link to="/all-products" className="transition-opacity hover:opacity-80">All Products</Link>
          <Link to="/capsules" className="transition-opacity hover:opacity-80">Capsules</Link>
          <Link to="/#about" className="transition-opacity hover:opacity-80">About</Link>
          <Link to="/#contact" className="transition-opacity hover:opacity-80">Contact</Link>
          {cartCount > 0 && cartHref && (
            <a
              href={cartHref}
              className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/10 px-2.5 py-1 text-[11px] font-bold tracking-[0.06em] text-white transition-opacity hover:opacity-85"
            >
              Cart
              <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-[10px] leading-5 text-[#9e0102]">
                {cartCount}
              </span>
            </a>
          )}
        </nav>
      </div>
    </header>
  );
};

export default CompactHeader;
