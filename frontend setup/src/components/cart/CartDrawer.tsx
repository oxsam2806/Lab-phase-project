import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import { closeDrawer } from "../../features/cart/cartSlice";
import { formatPrice } from "../../utils/formatPrice";
import CartItemRow from "./CartItemRow";

function CartDrawer() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const user = useAppSelector((state) => state.auth.user);
  const { cart, drawerOpen } = useAppSelector((state) => state.cart);
  const hasStockIssue = cart.items.some((item) => item.exceedsStock);
  const [mounted, setMounted] = useState(drawerOpen);

  useEffect(() => {
    if (drawerOpen) setMounted(true);
  }, [drawerOpen]);

  useEffect(() => {
    dispatch(closeDrawer());
  }, [dispatch, location.pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") dispatch(closeDrawer());
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [dispatch, drawerOpen]);

  if (!mounted) return null;

  const closing = !drawerOpen;

  const renderBody = () => {
    if (!user) {
      return (
        <div className="text-center py-12">
          <p className="text-stone-600 mb-4">Log in to see your cart.</p>
          <Link to="/login" className="text-emerald-700 font-semibold underline">Log in</Link>
        </div>
      );
    }
    if (user.role !== "customer") {
      return <p className="text-center text-stone-600 py-12">Carts are available on customer accounts only.</p>;
    }
    if (cart.items.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-stone-600 mb-4">Your cart is empty.</p>
          <Link to="/shop" className="text-emerald-700 font-semibold underline">Start shopping</Link>
        </div>
      );
    }
    return (
      <div className="divide-y divide-stone-200">
        {cart.items.map((item) => (
          <CartItemRow key={item.product._id} item={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50">
      <div
        className={`absolute inset-0 bg-black/40 ${closing ? "animate-fade-out" : "animate-fade-in"}`}
        onClick={() => dispatch(closeDrawer())}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        onAnimationEnd={() => {
          if (closing) setMounted(false);
        }}
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col ${
          closing ? "animate-slide-out-right" : "animate-slide-in-right"
        }`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-stone-200">
          <h2 className="text-lg font-semibold text-stone-800">
            Your cart {cart.itemCount > 0 && `(${cart.itemCount})`}
          </h2>
          <button
            onClick={() => dispatch(closeDrawer())}
            aria-label="Close cart"
            className="text-stone-500 hover:text-stone-800 transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5">{renderBody()}</div>

        {user?.role === "customer" && cart.items.length > 0 && (
          <div className="border-t border-stone-200 p-5 space-y-3">
            <div className="flex justify-between text-stone-800">
              <span>Subtotal</span>
              <span className="font-semibold">{formatPrice(cart.subtotal)}</span>
            </div>
            <p className="text-xs text-stone-500">Shipping is calculated at checkout.</p>
            {hasStockIssue && (
              <p className="text-xs text-red-600">Please fix the items marked in red before checking out.</p>
            )}
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/cart"
                className="text-center py-2.5 rounded-lg border border-emerald-700 text-emerald-700 font-medium transition-colors hover:bg-emerald-50"
              >
                View cart
              </Link>
              <Link
                to="/checkout"
                aria-disabled={hasStockIssue}
                onClick={(e) => hasStockIssue && e.preventDefault()}
                className={`text-center py-2.5 rounded-lg font-medium text-white transition-all duration-200 active:scale-[0.98] ${
                  hasStockIssue ? "bg-stone-400 cursor-not-allowed" : "bg-emerald-700 hover:bg-emerald-800"
                }`}
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

export default CartDrawer;