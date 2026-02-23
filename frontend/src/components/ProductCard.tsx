interface ProductCardProps {
  image: string;
  name: string;
}

const ProductCard = ({ image, name }: ProductCardProps) => {
  return (
    <article className="mx-auto flex w-full max-w-[320px] flex-col items-center">
      <img src={image} alt={name} className="h-[290px] w-[210px] object-contain md:h-[320px] md:w-[230px]" loading="lazy" />
      <div className="mt-6 w-full border-t border-black/70 pt-3 text-center">
        <h3 className="font-serif text-xl uppercase tracking-[0.12em] text-black md:text-2xl">{name}</h3>
      </div>
    </article>
  );
};

export default ProductCard;
