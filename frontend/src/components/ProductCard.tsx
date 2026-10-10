import { ReactNode } from "react";
import ProductImage from "./ProductImage";

interface ProductCardProps {
  image: string;
  name: string;
  category?: string;
  imageClassName?: string;
  overlay?: ReactNode;
}

const ProductCard = ({ image, name, category, overlay }: ProductCardProps) => {
  return (
    <article className="mx-auto flex w-full max-w-[320px] flex-col items-center">
      <ProductImage image={image} name={name} overlay={overlay} />
      <div className="mt-6 min-h-[88px] w-full border-t border-black/20 pt-4 text-center font-['Inter',sans-serif]">
        <h3 className="text-[22px] font-semibold leading-8 tracking-tight text-[#242424] md:text-2xl">{name}</h3>
        {category && <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#9e0102]">{category}</p>}
      </div>
    </article>
  );
};

export default ProductCard;
