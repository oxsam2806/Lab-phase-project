import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/useAppDispatch";
import { fetchWishlist } from "../features/wishlist/wishlistSlice";
import ProductGrid from "../components/product/ProductGrid";
import EmptyState from "../components/common/EmptyState";

function Wishlist() {
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  return (
    <section>
      <h1 className="text-2xl font-bold text-stone-800 mb-6">My wishlist</h1>
      {!loading && products.length === 0 ? (
        <EmptyState
          title="Your wishlist is empty"
          message="Tap the heart on any product to save it for later."
          action={<Link to="/shop" className="text-emerald-700 font-semibold underline">Browse the shop</Link>}
        />
      ) : (
        <ProductGrid products={products} loading={loading && products.length === 0} skeletonCount={4} />
      )}
    </section>
  );
}

export default Wishlist;