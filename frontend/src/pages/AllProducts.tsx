import { Link } from "react-router-dom";
import CompactHeader from "@/components/CompactHeader";
import classicCoffee from "@/assets/classic-coffee.png";
import aromaCoffee from "@/assets/aroma-coffee.png";
import creamCoffee from "@/assets/cream-coffee.png";
import blackCoffee from "@/assets/black-coffee.png";

const AllProducts = () => {
  return (
    <div className="min-h-screen bg-[#f7f4f1] text-[#1f1f1f]">
      <CompactHeader />
      <section className="bg-[#9e0102] py-14 text-white md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#ffd7d1]">Galla Espresso</p>
          <h1 className="mt-2 font-serif text-4xl md:text-6xl">All Products</h1>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-[#ffe8e4] md:text-base">
            Espresso is a wonderful blending of coffees Arabica and Robusta with controlled quality, using the
            Italian style during roasting of coffee, with our expertise and technique in the coffee industry. We
            cannot expect anything else but sweet espresso, aromatic and very delicious.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center rounded-md border border-[#ffd0ca] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-85"
          >
            Back To Home
          </Link>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 md:gap-8">
          <article className="rounded-2xl border border-[#e6dbd2] bg-white p-6 shadow-sm md:p-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr] md:items-center">
              <img src={classicCoffee} alt="Galla Classic Coffee" className="mx-auto h-48 w-auto object-contain" />
              <div>
                <h2 className="font-serif text-3xl text-[#9e0102] md:text-4xl">Classic</h2>
                <p className="mt-3 text-sm leading-7 text-[#454545] md:text-base">
                  This unique mixture obtained by the combination of high quality beans of Arabica and selected beans
                  of Robusta from the plains of South America.
                </p>
                <p className="mt-3 text-sm leading-7 text-[#454545] md:text-base">
                  Longer roasted (the blackened beans) results in smooth cream-foam and an intensive espresso
                  experience.
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-[#e6dbd2] bg-white p-6 shadow-sm md:p-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr] md:items-center">
              <img src={aromaCoffee} alt="Galla Aroma Coffee" className="mx-auto h-44 w-auto object-contain" />
              <div>
                <h2 className="font-serif text-3xl text-[#9e0102] md:text-4xl">Aroma</h2>
                <p className="mt-3 text-sm leading-7 text-[#454545] md:text-base">
                  Well defined mixture consisted of high quality Arabica and beans of Asiatic Robusta for certain
                  coffee lovers.
                </p>
                <p className="mt-3 text-sm leading-7 text-[#454545] md:text-base">
                  Careful quality control of the green coffee, which is middle roasted, results in perfect balance
                  and rich mixture.
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-[#e6dbd2] bg-white p-6 shadow-sm md:p-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr] md:items-center">
              <img src={creamCoffee} alt="Galla Cream Coffee" className="mx-auto h-44 w-auto object-contain" />
              <div>
                <h2 className="font-serif text-3xl text-[#9e0102] md:text-4xl">Cream</h2>
                <p className="mt-3 text-sm leading-7 text-[#454545] md:text-base">
                  Well defined mixture consisted of high quality Arabica and beans of Asiatic Robusta for certain
                  coffee lovers.
                </p>
                <p className="mt-3 text-sm leading-7 text-[#454545] md:text-base">
                  Careful quality control of the green coffee, which is middle roasted, results in perfect balance
                  and rich mixture.
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-[#e6dbd2] bg-white p-6 shadow-sm md:p-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr] md:items-center">
              <img src={blackCoffee} alt="Galla Black Coffee" className="mx-auto h-48 w-auto object-contain" />
              <div>
                <h2 className="font-serif text-3xl text-[#9e0102] md:text-4xl">Black</h2>
                <p className="mt-3 text-sm leading-7 text-[#454545] md:text-base">
                  This incredible blend is made from high-quality, carefully selected beans: 100% Arabica from the
                  plains of Brazil and Africa.
                </p>
                <p className="mt-3 text-sm leading-7 text-[#454545] md:text-base">
                  The combination of bean origin delivers a strong flavor, complete body, and balanced acidity for a
                  premium espresso experience.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};

export default AllProducts;
