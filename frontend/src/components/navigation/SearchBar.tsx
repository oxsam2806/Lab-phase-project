import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import { setSearch } from "../../features/products/productSlice";

function SearchBar({ className = "" }: { className?: string }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentSearch = useAppSelector((state) => state.products.filters.search);
  const [term, setTerm] = useState(currentSearch);

  useEffect(() => {
    setTerm(currentSearch);
  }, [currentSearch]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch(setSearch(term));
    navigate("/shop");
  };

  return (
    <form onSubmit={handleSubmit} role="search" className={`flex ${className}`}>
      <input
        type="search"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search threads, zippers, buttons..."
        aria-label="Search products"
        className="w-full rounded-l-lg border border-r-0 border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
      />
      <button type="submit" className="bg-emerald-700 text-white px-4 rounded-r-lg text-sm hover:bg-emerald-800">
        Search
      </button>
    </form>
  );
}

export default SearchBar;