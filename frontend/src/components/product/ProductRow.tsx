import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "../../types/product";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";

interface Props {
  title: string;
  products: Product[];
  loading?: boolean;
  viewAllLink?: string;
}

const itemClass = "shrink-0 snap-start w-[46%] sm:w-[31%] lg:w-[23.5%]";

function ProductRow({ title, products, loading, viewAllLink }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows, products.length, loading]);

  const scroll = (direction: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  };

  const arrowClass =
    "hidden md:flex items-center justify-center w-9 h-9 rounded-full border border-stone-300 bg-white text-stone-700 transition-all duration-200 hover:border-emerald-700 hover:text-emerald-700 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-stone-300 disabled:hover:text-stone-700";

  if (!loading && products.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-stone-800">{title}</h2>
        <div className="flex items-center gap-2">
          {viewAllLink && (
            <Link to={viewAllLink} className="text-sm text-emerald-700 font-semibold hover:underline mr-2">
              View all
            </Link>
          )}
          <button onClick={() => scroll(-1)} disabled={!canLeft} aria-label={`Scroll ${title} left`} className={arrowClass}>
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => scroll(1)} disabled={!canRight} aria-label={`Scroll ${title} right`} className={arrowClass}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none pb-2 -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        {loading
          ? Array.from({ length: 4 }, (_, i) => (
              <div key={i} className={itemClass}>
                <ProductCardSkeleton />
              </div>
            ))
          : products.map((product, index) => (
              <div
                key={product._id}
                className={`${itemClass} animate-fade-up`}
                style={{ animationDelay: `${Math.min(index, 6) * 60}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
      </div>
    </section>
  );
}

export default ProductRow;