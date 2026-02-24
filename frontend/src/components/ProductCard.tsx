import { ReactNode } from "react";

interface ProductCardProps {
  image: string;
  name: string;
  imageClassName?: string;
  overlay?: ReactNode;
}

const ProductCard = ({ image, name, imageClassName, overlay }: ProductCardProps) => {
  return (
    <article className="mx-auto flex w-full max-w-[320px] flex-col items-center">
      <div className="relative h-[290px] w-[210px] overflow-visible md:h-[320px] md:w-[230px]">
        {overlay && <div className="absolute right-1 top-12 z-10 md:right-2 md:top-14">{overlay}</div>}
        <img
          src={image}
          alt={name}
          className={`h-full w-full origin-bottom object-contain ${imageClassName || ""}`}
          loading="lazy"
        />
      </div>
      <div className="mt-8 w-full border-t border-black/70 pt-3 text-center">
        <h3 className="font-serif text-xl uppercase tracking-[0.12em] text-black md:text-2xl">{name}</h3>
      </div>
    </article>
  );
};

export default ProductCard;
