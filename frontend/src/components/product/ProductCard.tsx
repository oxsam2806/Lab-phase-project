import { Link } from "react-router-dom";
import type { Product } from "../../types/product";
import { formatPrice } from "../../utils/formatPrice";
import { getImageUrl } from "../../utils/imageUrl";
import { useShopActions } from "../../hooks/useShopActions";
import WishlistButton from "./WishlistButton";

function ProductCard({ product }: { product: Product }) {
  const { addItem, isAdding } = useShopActions();
  const image = getImageUrl(product.images[0]?.url);
  const outOfStock = product.stock === 0;
  const adding = isAdding(product._id);

  return (
      <div className="group relative h-full bg-white rounded-xl border border-stone-200 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-stone-200/70 hover:border-stone-300">
      <WishlistButton productId={product._id} className="absolute top-2 right-2 z-10" />

      <Link to={`/product/${product.slug}`} className="block aspect-square bg-stone-100 overflow-hidden">
        {image && (
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        )}
      </Link>

      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <p className="text-xs text-stone-500 mb-1">{product.category?.name}</p>
        <Link
          to={`/product/${product.slug}`}
          className="text-sm sm:text-base font-medium text-stone-800 line-clamp-2 mb-3 hover:text-emerald-700"
        >
          {product.name}
        </Link>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-1">
          <span className="text-base sm:text-lg font-semibold text-emerald-700">
            {formatPrice(product.price)}
          </span>
          <span className={`text-xs ${outOfStock ? "text-red-600" : "text-stone-500"}`}>
            {outOfStock ? "Out of stock" : `${product.stock} in stock`}
          </span>
        </div>
        <button
          onClick={() => addItem(product._id)}
          disabled={outOfStock || adding}
          className="mt-3 w-full text-sm py-2 rounded-lg bg-emerald-700 text-white transition-all duration-200 hover:bg-emerald-800 active:scale-[0.98] disabled:bg-stone-300 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {outOfStock ? "Out of stock" : adding ? "Adding..." : "Add to cart"}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;