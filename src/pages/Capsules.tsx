import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CompactHeader from "@/components/CompactHeader";
import capsuleClassic from "@/assets/yellow.jpeg";
import capsuleAroma from "@/assets/red.webp";
import capsuleBlack from "@/assets/black.jpeg";
import classicCoffee from "@/assets/classic-coffee.png";
import aromaCoffee from "@/assets/aroma-coffee.png";
import creamCoffee from "@/assets/cream-coffee.png";
import blackCoffee from "@/assets/black-coffee.png";

const capsuleProducts = [
  {
    id: "classic",
    name: "Capsules Classic",
    image: capsuleClassic,
    description: "Balanced and smooth cup with soft crema, designed for everyday espresso moments.",
    price: 6.4,
    netWeight: "10 capsules x 5 g (50 g)",
    roast: "Medium",
    intensity: "7/10",
    compatibility: "Nespresso Original compatible",
  },
  {
    id: "aroma",
    name: "Capsules Aroma",
    image: capsuleAroma,
    description: "Aromatic profile with richer fragrance and elegant aftertaste for specialty coffee lovers.",
    price: 6.9,
    netWeight: "10 capsules x 5 g (50 g)",
    roast: "Medium-Dark",
    intensity: "8/10",
    compatibility: "Nespresso Original compatible",
  },
  {
    id: "black",
    name: "Capsules Black",
    image: capsuleBlack,
    description: "Strong body and deeper roast character with long finish and bold espresso expression.",
    price: 7.2,
    netWeight: "10 capsules x 5 g (50 g)",
    roast: "Dark",
    intensity: "10/10",
    compatibility: "Nespresso Original compatible",
  },
];

const espressoProducts = [
  {
    id: "espresso-classic",
    name: "Galla Classic",
    image: classicCoffee,
    description:
      "This unique mixture combines high quality Arabica beans with selected Robusta beans from South America for a smooth crema and strong espresso character.",
  },
  {
    id: "espresso-aroma",
    name: "Galla Aroma",
    image: aromaCoffee,
    description:
      "Well defined mixture of high quality Arabica and Asiatic Robusta, carefully controlled and medium roasted for rich aroma and balance.",
  },
  {
    id: "espresso-cream",
    name: "Galla Cream",
    image: creamCoffee,
    description:
      "Balanced middle-roast blend with creamy texture and clean finish, crafted for consistent daily espresso enjoyment.",
  },
  {
    id: "espresso-black",
    name: "Galla Black",
    image: blackCoffee,
    description:
      "Premium espresso blend with deep character, full body, and balanced acidity for customers who prefer stronger flavor notes.",
  },
];

const Capsules = () => {
  const [capsuleQty, setCapsuleQty] = useState<Record<string, number>>({
    classic: 0,
    aroma: 0,
    black: 0,
  });

  const selectedCapsules = useMemo(
    () => capsuleProducts.filter((product) => capsuleQty[product.id] > 0),
    [capsuleQty],
  );

  const totalCapsulePacks = selectedCapsules.reduce((sum, product) => sum + capsuleQty[product.id], 0);
  const capsuleTotal = selectedCapsules.reduce((sum, product) => sum + product.price * capsuleQty[product.id], 0);
  const shippingFee = totalCapsulePacks === 0 ? 0 : capsuleTotal >= 35 ? 0 : 3.9;
  const finalTotal = capsuleTotal + shippingFee;
  const hasCapsuleSelection = totalCapsulePacks > 0;

  const orderBody =
    selectedCapsules.length === 0
      ? "Hello Galla Team,%0D%0A%0D%0AI want to place an order for capsules."
      : encodeURIComponent(
          `Hello Galla Team,\n\nI want to order the following capsules:\n${selectedCapsules
            .map(
              (product) =>
                `- ${product.name}: ${capsuleQty[product.id]} pack(s) x EUR ${product.price.toFixed(2)} = EUR ${(
                  capsuleQty[product.id] * product.price
                ).toFixed(2)}`,
            )
            .join("\n")}\n\nTotal: EUR ${capsuleTotal.toFixed(2)}\n\nPlease contact me to confirm delivery details.`,
        );
  const orderEmailLink = `mailto:orders@galla.mk?subject=${encodeURIComponent("Galla Capsules Order")}&body=${orderBody}`;

  const increaseCapsule = (id: string) => {
    setCapsuleQty((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const decreaseCapsule = (id: string) => {
    setCapsuleQty((prev) => ({ ...prev, [id]: Math.max(0, prev[id] - 1) }));
  };

  return (
    <div className="min-h-screen bg-white text-[#1f1f1f]">
      <CompactHeader />
      <div className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9e0102]">New Product Line</p>
          <h1 className="mt-2 font-serif text-4xl md:text-5xl">Galla Capsules</h1>
          <p className="mt-4 text-base leading-8 text-[#3a3a3a] md:text-lg">
            Capsules are now part of the Galla portfolio. Choose Classic, Aroma, or Black and place an order with a
            standard checkout-style summary.
          </p>
          <Link
            to="/"
            className="mt-5 inline-flex items-center rounded-md border border-[#cab8a6] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#5f5347] transition-colors hover:bg-[#f7f1ea]"
          >
            Back To Home
          </Link>
        </div>

        <div className={`mt-10 grid grid-cols-1 gap-8 ${hasCapsuleSelection ? "lg:grid-cols-[1.55fr_1fr]" : ""}`}>
          <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 ${hasCapsuleSelection ? "" : "lg:grid-cols-3"}`}>
            {capsuleProducts.map((product) => (
              <article key={product.id} className="rounded-2xl border border-[#dbcfc4] bg-white p-6 shadow-md">
                <div className="rounded-xl bg-[#f7f3ee] p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="mx-auto h-40 w-40 rounded-full object-cover md:h-44 md:w-44"
                  />
                </div>

                <div className="mt-4 flex items-start justify-between gap-3">
                  <h2 className="font-serif text-2xl leading-tight">{product.name}</h2>
                  <p className="text-lg font-bold text-[#9e0102]">EUR {product.price.toFixed(2)}</p>
                </div>
                <p className="mt-2 text-sm leading-7 text-[#4f4f4f]">{product.description}</p>

                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-[#3b3b3b] md:text-sm">
                  <p><span className="font-semibold">Weight:</span> {product.netWeight}</p>
                  <p><span className="font-semibold">Roast:</span> {product.roast}</p>
                  <p><span className="font-semibold">Intensity:</span> {product.intensity}</p>
                  <p><span className="font-semibold">Format:</span> Box of 10 capsules</p>
                  <p className="col-span-2"><span className="font-semibold">Compatibility:</span> {product.compatibility}</p>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs">
                  <p className="font-semibold text-green-700">In stock</p>
                  <p className="text-[#5a5a5a]">Dispatch in 24h</p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[#e6ddd4] pt-4">
                  <div className="inline-flex items-center rounded-md border border-[#cab8a6]">
                    <button
                      type="button"
                      onClick={() => decreaseCapsule(product.id)}
                      className="h-9 w-9 text-lg leading-none transition-colors hover:bg-[#f4ece4]"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-sm font-semibold">{capsuleQty[product.id]}</span>
                    <button
                      type="button"
                      onClick={() => increaseCapsule(product.id)}
                      className="h-9 w-9 text-lg leading-none transition-colors hover:bg-[#f4ece4]"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-xs text-[#5d554e]">VAT included</p>
                </div>
              </article>
            ))}
          </div>

          {hasCapsuleSelection && (
          <aside className="h-fit rounded-2xl border border-[#d6c8bb] bg-white p-6 shadow-md md:sticky md:top-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9e0102]">Order Summary</p>
            <p className="mt-2 text-sm text-[#4a4a4a]">
              Packs selected: <span className="font-semibold text-[#1f1f1f]">{totalCapsulePacks}</span>
            </p>

            <div className="mt-4 space-y-2 border-b border-[#e8ddd2] pb-4 text-sm text-[#383838]">
              {selectedCapsules.length === 0 ? (
                <p>No products selected yet.</p>
              ) : (
                selectedCapsules.map((product) => (
                  <div key={product.id} className="flex items-center justify-between gap-2">
                    <p className="line-clamp-1">{product.name} x {capsuleQty[product.id]}</p>
                    <p className="font-medium">EUR {(capsuleQty[product.id] * product.price).toFixed(2)}</p>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between text-[#4b4b4b]">
                <p>Subtotal</p>
                <p>EUR {capsuleTotal.toFixed(2)}</p>
              </div>
              <div className="flex items-center justify-between text-[#4b4b4b]">
                <p>Shipping</p>
                <p>{shippingFee === 0 ? "Free" : `EUR ${shippingFee.toFixed(2)}`}</p>
              </div>
              <div className="flex items-center justify-between border-t border-[#e8ddd2] pt-3 text-base font-bold text-[#1f1f1f]">
                <p>Total</p>
                <p>EUR {finalTotal.toFixed(2)}</p>
              </div>
            </div>

            <a
              href={orderEmailLink}
              className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-[#9e0102] px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90"
            >
              Proceed To Order
            </a>

            <p className="mt-3 text-xs text-[#6d6259]">Free shipping above EUR 35. Orders are prepared within 24 hours.</p>
            <p className="mt-2 text-xs text-[#6d6259]">
              Checkout currently opens email to <span className="font-semibold">orders@galla.mk</span>.
            </p>
          </aside>
          )}
        </div>

        <div className="mt-16 border-t border-[#dbcfc4] pt-12">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9e0102]">Espresso Products</p>
          <h2 className="mt-2 font-serif text-3xl md:text-4xl">Also Available To Order</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#4a4a4a] md:text-base">
            Classic, Aroma, Cream, and Black espresso are also available for purchase. Prices are not displayed yet.
            Contact us for order details.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {espressoProducts.map((product) => (
              <article key={product.id} className="rounded-2xl border border-[#dbcfc4] bg-white p-6 shadow-md">
                <div className="rounded-xl bg-[#f7f3ee] p-4">
                  <img src={product.image} alt={product.name} className="mx-auto h-40 w-auto object-contain md:h-44" />
                </div>
                <h3 className="mt-4 font-serif text-2xl text-[#1f1f1f]">{product.name}</h3>
                <p className="mt-2 text-sm leading-7 text-[#4f4f4f]">{product.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#9e0102]">Available For Order</p>
                  <a
                    href="mailto:orders@galla.mk?subject=Espresso%20Order%20Inquiry"
                    className="inline-flex items-center rounded-md bg-[#9e0102] px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-white transition-opacity hover:opacity-90"
                  >
                    Request Offer
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Capsules;
