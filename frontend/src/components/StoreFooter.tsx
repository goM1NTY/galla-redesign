import { Link } from "react-router-dom";

const policyLinks = [
  ["Privacy Policy", "/privacy"],
  ["Terms & Conditions", "/terms"],
  ["Shipping Policy", "/shipping"],
  ["Returns & Refunds", "/returns"],
  ["Company Details", "/company-details"],
] as const;

const StoreFooter = () => (
  <footer className="bg-[#9e0102] py-8 text-[#ffe6e2]">
    <div className="mx-auto max-w-7xl px-4">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
        <div>
          <p className="font-serif text-2xl text-white">Galla Caffe</p>
          <p className="mt-2 text-sm">Ilindenska 160, Tetovo, North Macedonia</p>
          <p className="text-sm">minetamexhiti01@gmail.com · +389 44 333 375</p>
        </div>
        <nav aria-label="Store policies" className="flex max-w-2xl flex-wrap gap-x-5 gap-y-2 text-sm">
          {policyLinks.map(([label, path]) => (
            <Link key={path} to={path} className="hover:underline">
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <p className="mt-6 border-t border-[#b95a58] pt-4 text-xs text-[#ffd7d1]">
        © {new Date().getFullYear()} Galla Caffe. All rights reserved.
      </p>
    </div>
  </footer>
);

export default StoreFooter;
