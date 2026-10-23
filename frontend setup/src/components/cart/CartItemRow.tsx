import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import type { CartItem } from "../../types/cart";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import { removeCartItem, updateCartItem } from "../../features/cart/cartSlice";
import { formatPrice } from "../../utils/formatPrice";
import { getImageUrl } from "../../utils/imageUrl";
import QuantitySelector from "./QuantitySelector";

function CartItemRow({ item }: { item: CartItem }) {
  const dispatch = useAppDispatch();
  const { product } = item;
  const pending = useAppSelector((state) => state.cart.pendingProductIds.includes(product._id));
  const image = getImageUrl(product.image ?? undefined);
  const max = Math.max(1, Math.min(product.stock, 99));

  const changeQuantity = async (quantity: number) => {
    try {
      await dispatch(updateCartItem({ productId: product._id, quantity: Math.min(quantity, max) })).unwrap();
    } catch (error) {
      toast.error(error as string);
    }
  };

  const remove = async () => {
    try {
      const result = await dispatch(removeCartItem({ productId: product._id })).unwrap();
      toast.success(result.message);
    } catch (error) {
      toast.error(error as string);
    }
  };

  return (
    <div className={`flex gap-3 py-4 transition-opacity ${pending ? "opacity-60" : ""}`}>
      <Link to={`/product/${product.slug}`} className="w-20 h-20 shrink-0 rounded-lg bg-stone-100 overflow-hidden">
        {image && <img src={image} alt={product.name} className="w-full h-full object-cover" />}
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-2">
          <Link
            to={`/product/${product.slug}`}
            className="text-sm font-medium text-stone-800 line-clamp-2 hover:text-emerald-700"
          >
            {product.name}
          </Link>
          <button
            onClick={remove}
            disabled={pending}
            aria-label={`Remove ${product.name}`}
            className="text-stone-400 hover:text-red-600 shrink-0"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <p className="text-xs text-stone-500 mt-1">{formatPrice(product.price)} each</p>

        <div className="flex items-center justify-between mt-2">
          <QuantitySelector
            value={item.quantity}
            max={max}
            onChange={changeQuantity}
            disabled={pending || product.stock === 0}
          />
          <span className="font-semibold text-stone-800">{formatPrice(item.lineTotal)}</span>
        </div>

        {item.exceedsStock && (
          <p className="text-xs text-red-600 mt-2">
            {product.stock === 0
              ? "Now out of stock. Please remove this item."
              : `Only ${product.stock} left. Please reduce the quantity.`}
          </p>
        )}
      </div>
    </div>
  );
}

export default CartItemRow;