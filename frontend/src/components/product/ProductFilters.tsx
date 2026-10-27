import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import { resetFilters, setInStock, setPriceRange } from "../../features/products/productSlice";

function ProductFilters() {
  const dispatch = useAppDispatch();
  const { filters, categories } = useAppSelector((state) => state.products);

  const [minPrice, setMinPrice] = useState(filters.minPrice);
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice);
  const [error, setError] = useState("");

  useEffect(() => {
    setMinPrice(filters.minPrice);
    setMaxPrice(filters.maxPrice);
  }, [filters.minPrice, filters.maxPrice]);

  const applyPrice = (e: FormEvent) => {
    e.preventDefault();
    if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
      setError("Minimum price can't be higher than maximum");
      return;
    }
    setError("");
    dispatch(setPriceRange({ minPrice, maxPrice }));
  };

  const categoryClass = (active: boolean) =>
    `block px-3 py-2 rounded-lg text-sm ${
      active ? "bg-emerald-50 text-emerald-800 font-semibold" : "text-stone-600 hover:bg-stone-100"
    }`;

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-4 space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-stone-800 mb-2">Categories</h2>
        <Link to="/shop" className={categoryClass(!filters.category)}>
          All categories
        </Link>
        {categories.map((category) => (
          <Link
            key={category._id}
            to={`/category/${category.slug}`}
            className={categoryClass(filters.category === category.slug)}
          >
            {category.name}
          </Link>
        ))}
      </div>

      <form onSubmit={applyPrice}>
        <h2 className="text-sm font-semibold text-stone-800 mb-2">Price (USD)</h2>
        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Min"
            aria-label="Minimum price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
          />
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Max"
            aria-label="Maximum price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
          />
        </div>
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        <button
          type="submit"
          className="mt-2 w-full text-sm py-2 rounded-lg border border-emerald-700 text-emerald-700 hover:bg-emerald-50"
        >
          Apply price
        </button>
      </form>

      <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
        <input
          type="checkbox"
          checked={filters.inStock}
          onChange={(e) => dispatch(setInStock(e.target.checked))}
          className="h-4 w-4 accent-emerald-700"
        />
        In stock only
      </label>

      <button
        onClick={() => dispatch(resetFilters())}
        className="w-full text-sm text-stone-500 hover:text-stone-800 underline"
      >
        Clear filters
      </button>
    </div>
  );
}

export default ProductFilters;