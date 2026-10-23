import { Heart } from "lucide-react";
import { useShopActions } from "../../hooks/useShopActions";

interface Props {
  productId: string;
  className?: string;
}

function WishlistButton({ productId, className = "" }: Props) {
  const { toggleWishlist, isSaved } = useShopActions();
  const saved = isSaved(productId);

  return (
    <button
      type="button"
      onClick={() => toggleWishlist(productId)}
      aria-pressed={saved}
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      className={`p-2 rounded-full bg-white/90 border border-stone-200 transition-all duration-200 hover:border-red-300 hover:scale-110 active:scale-90 ${className}`}    >
      <Heart size={18} className={saved ? "fill-red-500 text-red-500" : "text-stone-500"} />
    </button>
  );
}

export default WishlistButton;