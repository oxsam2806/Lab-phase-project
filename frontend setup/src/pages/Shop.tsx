import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/useAppDispatch";
import {
  fetchCategories,
  fetchProducts,
  setCategory,
  setPage,
  setSearch,
  setSort,
} from "../features/products/productSlice";
import type { SortOption } from "../types/product";
import ProductFilters from "../components/product/ProductFilters";
import ProductGrid from "../components/product/ProductGrid";
import Pagination from "../components/common/Pagination";
import EmptyState from "../components/common/EmptyState";

const sortLabels: Record<SortOption, string> = {
  newest: "Newest",
  price_asc: "Price: low to high",
  price_desc: "Price: high to low",
  rating: "Top rated",
  name: "Name: A to Z",
};

function Shop() {
  const dispatch = useAppDispatch();
  const { slug } = useParams<{ slug: string }>();
  const { items, total, totalPages, loading, error, filters, categories } = useAppSelector(
    (state) => state.products
  );
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(setCategory(slug ?? ""));
  }, [dispatch, slug]);

  useEffect(() => {
    if (categories.length === 0) dispatch(fetchCategories());
  }, [dispatch, categories.length]);

  useEffect(() => {
    const request = dispatch(fetchProducts());
    return () => request.abort();
  }, [dispatch, filters]);

  const categoryName = categories.find((c) => c.slug === filters.category)?.name;
  const heading = categoryName ?? "All products";

  const changePage = (page: number) => {
    dispatch(setPage(page));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">{heading}</h1>
          {filters.search ? (
            <p className="text-sm text-stone-600 mt-1">
              {total} results for "{filters.search}"{" "}
              <button onClick={() => dispatch(setSearch(""))} className="text-emerald-700 underline">
                Clear search
              </button>
            </p>
          ) : (
            <p className="text-sm text-stone-600 mt-1">{total} products</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters((open) => !open)}
            className="lg:hidden text-sm px-4 py-2 rounded-lg border border-stone-300 text-stone-700"
          >
            {showFilters ? "Hide filters" : "Filters"}
          </button>
          <label className="text-sm text-stone-600 flex items-center gap-2">
            <span className="hidden sm:inline">Sort by</span>
            <select
              value={filters.sort}
              onChange={(e) => dispatch(setSort(e.target.value as SortOption))}
              className="rounded-lg border border-stone-300 px-3 py-2 text-sm bg-white"
            >
              {Object.entries(sortLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-6">
        <aside className={`${showFilters ? "block" : "hidden"} lg:block`}>
          <ProductFilters />
        </aside>

        <div>
          {error ? (
            <EmptyState
              title="Something went wrong"
              message={error}
              action={
                <button
                  onClick={() => dispatch(fetchProducts())}
                  className="bg-emerald-700 text-white px-5 py-2 rounded-lg"
                >
                  Try again
                </button>
              }
            />
          ) : !loading && items.length === 0 ? (
            <EmptyState
              title="No products found"
              message="Try a different search or clear your filters."
            />
          ) : (
            <>
              <ProductGrid products={items} loading={loading} />
              {!loading && (
                <Pagination page={filters.page} totalPages={totalPages} onChange={changePage} />
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default Shop;