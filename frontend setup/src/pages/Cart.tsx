import { useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../hooks/useAppDispatch";
import { clearCart, fetchCart } from "../features/cart/cartSlice";
import { formatPrice } from "../utils/formatPrice";
import CartItemRow from "../components/cart/CartItemRow";
import EmptyState from "../components/common/EmptyState";

function CartPage() {
  const dispatch = useAppDispatch();
  const { cart, loading } = useAppSelector((state) => state.cart);
  const hasStockIssue = cart.items.some((item) => item.exceedsStock);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleClear = async () => {
    if (!window.confirm("Remove all items from your cart?")) return;
    try {
      const result = await dispatch(clearCart()).unwrap();
      toast.success(result.message);
    } catch (error) {
      toast.error(error as string);
    }
  };

  if (loading && cart.items.length === 0) {
    return <p className="text-center text-stone-500 py-16">Loading your cart...</p>;
  }

  if (cart.items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        message="Browse the shop and add the supplies you need."
        action={
          <Link to="/shop" className="inline-block bg-emerald-700 text-white px-5 py-2.5 rounded-lg">
            Go to shop
          </Link>
        }
      />
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-800">Your cart</h1>
        <button onClick={handleClear} className="text-sm text-stone-500 hover:text-red-600 underline">
          Clear cart
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="bg-white rounded-xl border border-stone-200 px-4 sm:px-6 divide-y divide-stone-200">
          {cart.items.map((item) => (
            <CartItemRow key={item.product._id} item={item} />
          ))}
        </div>

        <aside className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-stone-800">Order summary</h2>
          <div className="flex justify-between text-sm text-stone-600">
            <span>Items</span>
            <span>{cart.itemCount}</span>
          </div>
          <div className="flex justify-between text-stone-800">
            <span>Subtotal</span>
            <span className="font-semibold">{formatPrice(cart.subtotal)}</span>
          </div>
          <p className="text-xs text-stone-500">Shipping is calculated at checkout.</p>
          {hasStockIssue && (
            <p className="text-sm text-red-600">Some items have stock issues. Please update them to continue.</p>
          )}
          <Link
            to="/checkout"
            aria-disabled={hasStockIssue}
            onClick={(e) => hasStockIssue && e.preventDefault()}
            className={`block text-center py-3 rounded-lg font-medium text-white ${
              hasStockIssue ? "bg-stone-400 cursor-not-allowed" : "bg-emerald-700 hover:bg-emerald-800"
            }`}
          >
            Proceed to checkout
          </Link>
          <Link to="/shop" className="block text-center text-sm text-emerald-700 hover:underline">
            Continue shopping
          </Link>
        </aside>
      </div>
    </section>
  );
}

export default CartPage;