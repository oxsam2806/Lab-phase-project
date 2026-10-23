import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/useAppDispatch";
import { fetchCategories } from "../features/products/productSlice";
import { productApi } from "../services/api/productApi";
import type { Product } from "../types/product";
import ProductRow from "../components/product/ProductRow";

function Home() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.products.categories);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [budgetPicks, setBudgetPicks] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (categories.length === 0) dispatch(fetchCategories());
  }, [dispatch, categories.length]);

  useEffect(() => {
    Promise.all([
      productApi.list({ sort: "newest", limit: 12 }),
      productApi.list({ maxPrice: "10", inStock: true, sort: "price_asc", limit: 12 }),
    ])
      .then(([latest, budget]) => {
        setNewArrivals(latest.products);
        setBudgetPicks(budget.products);
      })
      .catch(() => {
        setNewArrivals([]);
        setBudgetPicks([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-14">
      <section className="bg-emerald-800 text-white rounded-2xl px-6 py-14 sm:px-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Everything your sewing room needs</h1>
        <p className="text-emerald-100 max-w-xl mx-auto mb-8">
          Threads, needles, zippers, buttons, fabrics and machine parts from trusted sellers.
        </p>
        <Link
          to="/shop"
          className="inline-block bg-white text-emerald-800 font-semibold px-6 py-3 rounded-lg transition-all duration-200 hover:bg-emerald-50 active:scale-[0.98]"
        >
          Start shopping
        </Link>
      </section>

      {categories.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-stone-800 mb-4">Shop by category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/category/${category.slug}`}
                className="bg-white border border-stone-200 rounded-xl p-4 text-center text-sm font-medium text-stone-700 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-emerald-700 hover:text-emerald-700"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <ProductRow title="New arrivals" products={newArrivals} loading={loading} viewAllLink="/shop" />
      <ProductRow title="Under $10" products={budgetPicks} loading={loading} />

      {!loading && newArrivals.length === 0 && (
        <p className="text-stone-600">New products are on the way. Check back soon.</p>
      )}
    </div>
  );
}

export default Home;