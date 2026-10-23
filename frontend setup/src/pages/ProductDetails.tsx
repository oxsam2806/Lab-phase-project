import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { productApi } from "../services/api/productApi";
import type { Product } from "../types/product";
import { formatPrice } from "../utils/formatPrice";
import { getImageUrl } from "../utils/imageUrl";
import EmptyState from "../components/common/EmptyState";
import QuantitySelector from "../components/cart/QuantitySelector";
import WishlistButton from "../components/product/WishlistButton";
import { useShopActions } from "../hooks/useShopActions";

function ProductDetails() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem, isAdding } = useShopActions();

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    setLoading(true);
    setError("");
    productApi
      .getBySlug(slug)
      .then((data) => {
        if (cancelled) return;
        setProduct(data);
        setActiveImage(0);
        setQuantity(1);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-8 animate-pulse">
        <div className="aspect-square bg-stone-200 rounded-xl" />
        <div className="space-y-4">
          <div className="h-4 w-1/4 bg-stone-200 rounded" />
          <div className="h-8 w-3/4 bg-stone-200 rounded" />
          <div className="h-6 w-1/4 bg-stone-200 rounded" />
          <div className="h-24 w-full bg-stone-200 rounded" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <EmptyState
        title="Product not available"
        message={error || "This product could not be found."}
        action={<Link to="/shop" className="text-emerald-700 font-semibold underline">Back to shop</Link>}
      />
    );
  }

  const mainImage = getImageUrl(product.images[activeImage]?.url);
  const outOfStock = product.stock === 0;

  return (
    <section>
      <nav className="text-sm text-stone-500 mb-6" aria-label="Breadcrumb">
        <Link to="/shop" className="hover:text-emerald-700">Shop</Link>
        <span className="mx-2">/</span>
        <Link to={`/category/${product.category.slug}`} className="hover:text-emerald-700">
          {product.category.name}
        </Link>
      </nav>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="aspect-square bg-stone-100 rounded-xl overflow-hidden border border-stone-200">
            {mainImage && <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3 mt-3 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={image.url}
                  onClick={() => setActiveImage(index)}
                  aria-label={`Show image ${index + 1}`}
                  className={`w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 ${
                    index === activeImage ? "border-emerald-700" : "border-transparent"
                  }`}
                >
                  <img src={getImageUrl(image.url) ?? ""} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm text-stone-500 mb-1">{product.category.name}</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 mb-3">{product.name}</h1>

          <p className="text-sm text-stone-600 mb-4">
            {product.ratingCount > 0
              ? `${product.ratingAverage.toFixed(1)} out of 5 (${product.ratingCount} reviews)`
              : "No reviews yet"}
          </p>

          <p className="text-3xl font-semibold text-emerald-700 mb-4">{formatPrice(product.price)}</p>

          <p
            className={`inline-block text-sm font-medium px-3 py-1 rounded-full mb-6 ${
              outOfStock ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-800"
            }`}
          >
            {outOfStock ? "Out of stock" : `In stock: ${product.stock} available`}
          </p>
                    {!outOfStock && (
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <QuantitySelector
                value={quantity}
                max={Math.max(1, Math.min(product.stock, 99))}
                onChange={setQuantity}
              />
              <button
                onClick={() => addItem(product._id, quantity)}
                disabled={isAdding(product._id)}
                className="flex-1 min-w-40 bg-emerald-700 text-white font-medium py-2.5 px-6 rounded-lg hover:bg-emerald-800 disabled:opacity-60"
              >
                {isAdding(product._id) ? "Adding..." : "Add to cart"}
              </button>
              <WishlistButton productId={product._id} />
            </div>
          )}

          <div className="border-t border-stone-200 pt-6 space-y-2 text-sm text-stone-600">
            <p>Sold by <span className="font-medium text-stone-800">{product.seller.name}</span></p>
            {product.brand && <p>Brand: {product.brand}</p>}
            {product.sku && <p>SKU: {product.sku}</p>}
          </div>

          <div className="border-t border-stone-200 pt-6 mt-6">
            <h2 className="text-lg font-semibold text-stone-800 mb-2">Description</h2>
            <p className="text-stone-600 whitespace-pre-line leading-relaxed">{product.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;