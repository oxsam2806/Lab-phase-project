import type { Product } from "../../types/product";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";

interface Props {
  products: Product[];
  loading?: boolean;
  skeletonCount?: number;
}

function ProductGrid({ products, loading, skeletonCount = 8 }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
      {loading
        ? Array.from({ length: skeletonCount }, (_, i) => <ProductCardSkeleton key={i} />)
        : products.map((product, index) => (
            <div
              key={product._id}
              className="animate-fade-up"
              style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
    </div>
  );
}

export default ProductGrid;