import { Link } from "react-router-dom";
import CompactHeader from "@/components/CompactHeader";
import StoreFooter from "@/components/StoreFooter";
import classicCoffee from "@/assets/classic-coffee.webp";
import aromaCoffee from "@/assets/aroma-coffee.webp";
import creamCoffee from "@/assets/cream-coffee.webp";
import blackCoffee from "@/assets/black-coffee.webp";

const AllProducts = () => {
  return (
    <div className="min-h-screen bg-[#f7f4f1] text-[#1f1f1f]">
      <CompactHeader />
      <section className="bg-[#9e0102] py-14 text-white md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#ffd7d1]">Galla Espresso</p>
          <h1 className="mt-2 font-serif text-4xl md:text-6xl">Galla Collection</h1>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-[#ffe8e4] md:text-base">
            Explore our Classic, Aroma, Cream, and Black espresso blends, made with selected coffee beans
            and roasted in the Italian tradition.
          </p>
          <Link
            to="/#about"
            className="mt-6 inline-flex items-center rounded-md border border-[#ffd0ca] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-85"
          >
            Discover More
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
                  A blend of high-quality Arabica and selected Robusta beans from South America.
                </p>
                <p className="mt-3 text-sm leading-7 text-[#454545] md:text-base">
                  A longer roast produces smooth crema and an intense espresso.
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-[#e6dbd2] bg-white p-6 shadow-sm md:p-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr] md:items-center">
              <img src={aromaCoffee} alt="Galla Aroma Coffee" loading="lazy" className="mx-auto h-44 w-auto object-contain" />
              <div>
                <h2 className="font-serif text-3xl text-[#9e0102] md:text-4xl">Aroma</h2>
                <p className="mt-3 text-sm leading-7 text-[#454545] md:text-base">
                  A blend of high-quality Arabica and Asian Robusta beans.
                </p>
                <p className="mt-3 text-sm leading-7 text-[#454545] md:text-base">
                  Carefully selected green beans and a medium roast produce a rich, balanced espresso.
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-[#e6dbd2] bg-white p-6 shadow-sm md:p-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr] md:items-center">
              <img src={creamCoffee} alt="Galla Cream Coffee" loading="lazy" className="mx-auto h-44 w-auto object-contain" />
              <div>
                <h2 className="font-serif text-3xl text-[#9e0102] md:text-4xl">Cream</h2>
                <p className="mt-3 text-sm leading-7 text-[#454545] md:text-base">
                  A blend of high-quality Arabica and Asian Robusta beans.
                </p>
                <p className="mt-3 text-sm leading-7 text-[#454545] md:text-base">
                  Carefully selected green beans and a medium roast produce a rich, balanced espresso.
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-[#e6dbd2] bg-white p-6 shadow-sm md:p-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr] md:items-center">
              <img src={blackCoffee} alt="Galla Black Coffee" loading="lazy" className="mx-auto h-48 w-auto object-contain" />
              <div>
                <h2 className="font-serif text-3xl text-[#9e0102] md:text-4xl">Black</h2>
                <p className="mt-3 text-sm leading-7 text-[#454545] md:text-base">
                  A 100% Arabica blend made with carefully selected beans from Brazil and Africa.
                </p>
                <p className="mt-3 text-sm leading-7 text-[#454545] md:text-base">
                  A full-bodied espresso with a rich aroma and balanced acidity.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>
      <StoreFooter />
    </div>
  );
};

export default AllProducts;
