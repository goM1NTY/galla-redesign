import { CSSProperties, ReactNode, useState } from "react";

interface ProductImageProps {
  image: string;
  name: string;
  overlay?: ReactNode;
}

const ProductImage = ({ image, name, overlay }: ProductImageProps) => {
  const [imageStyle, setImageStyle] = useState<CSSProperties>();

  const alignProduct = (img: HTMLImageElement) => {
    // Measure the pack, excluding pale background padding and soft shadows.
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let top = canvas.height, bottom = -1, left = canvas.width, right = -1;
    for (let y = 0; y < canvas.height; y++) {
      let count = 0, rowLeft = canvas.width, rowRight = -1;
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4;
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const darkest = Math.min(r, g, b), lightest = Math.max(r, g, b);
        if (data[i + 3] > 200 && (lightest < 80 || (lightest - darkest > 35 && darkest < 110))) {
          count++;
          rowLeft = Math.min(rowLeft, x);
          rowRight = Math.max(rowRight, x);
        }
      }
      if (count >= Math.max(3, canvas.width * 0.015)) {
        top = Math.min(top, y);
        bottom = y;
        left = Math.min(left, rowLeft);
        right = Math.max(right, rowRight);
      }
    }
    if (bottom <= top) return;
    const scale = Math.min(230 / (bottom - top + 1), 220 / (right - left + 1));
    setImageStyle({
      position: "absolute",
      height: canvas.height * scale,
      width: canvas.width * scale,
      maxWidth: "none",
      top: 8 + 230 - (bottom + 1) * scale,
      left: `calc(50% - ${((left + right) / 2) * scale}px)`,
    });
  };
  return (
    <div className="relative flex h-[260px] w-full items-center justify-center overflow-hidden">
      {overlay && <div className="absolute right-2 top-3 z-10">{overlay}</div>}
      <img key={image} src={image} alt={name} onLoad={(event) => alignProduct(event.currentTarget)} style={imageStyle} className="h-[230px] w-auto object-contain" loading="lazy" />
    </div>
  );
};

export default ProductImage;
