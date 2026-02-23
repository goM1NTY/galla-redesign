import { Link } from "react-router-dom";
import gallaLogo from "@/assets/Gemini_Generated_Image_i2ijc5i2ijc5i2ij.png";

const CompactHeader = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-[#c14546] bg-[#9e0102] text-white">
      <div className="flex items-center justify-between gap-4 pl-5 pr-4 py-2">
        <Link to="/" className="inline-flex items-center self-start">
          <img src={gallaLogo} alt="Galla Espresso Italiano" className="h-14 w-auto object-contain md:h-16" />
        </Link>

        <nav className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.08em] md:text-xs">
          <Link to="/all-products" className="transition-opacity hover:opacity-80">All Products</Link>
          <Link to="/capsules" className="transition-opacity hover:opacity-80">Capsules</Link>
          <Link to="/#about" className="transition-opacity hover:opacity-80">About</Link>
          <Link to="/#contact" className="transition-opacity hover:opacity-80">Contact</Link>
        </nav>
      </div>
    </header>
  );
};

export default CompactHeader;
