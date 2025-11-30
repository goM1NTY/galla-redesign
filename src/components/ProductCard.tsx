import { useState } from "react";

interface ProductCardProps {
  image: string;
  name: string;
  subtitle: string;
  description: string;
  accentColor: string;
}

const ProductCard = ({ image, name, subtitle, description, accentColor }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-card rounded-lg overflow-hidden hover-lift hover:shadow-[var(--shadow-product-hover)] shadow-[var(--shadow-product)] transition-all duration-300">
        {/* Image Container */}
        <div className="relative bg-secondary p-8 overflow-hidden">
          <div className="relative z-10 transition-transform duration-500 group-hover:scale-105">
            <img
              src={image}
              alt={name}
              className="w-full h-80 object-contain drop-shadow-2xl"
            />
          </div>
          {/* Animated background accent */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at center, ${accentColor} 0%, transparent 70%)`,
            }}
          />
        </div>

        {/* Content */}
        <div className="p-6 relative">
          <div
            className="absolute top-0 left-0 w-1 h-full transition-all duration-300 group-hover:w-2"
            style={{ backgroundColor: accentColor }}
          />
          <div className="pl-4">
            <h3 className="text-2xl font-bold mb-2 transition-colors duration-300 group-hover:text-primary">
              {name}
            </h3>
            <p className="text-sm text-muted-foreground uppercase tracking-wide mb-3">
              {subtitle}
            </p>
            
            {/* Description appears on hover */}
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                isHovered ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <p className="text-sm text-foreground/80 leading-relaxed pt-2 border-t border-border">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
