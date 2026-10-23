function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden animate-pulse">
      <div className="aspect-square bg-stone-200" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-1/3 bg-stone-200 rounded" />
        <div className="h-4 w-4/5 bg-stone-200 rounded" />
        <div className="h-5 w-1/4 bg-stone-200 rounded" />
      </div>
    </div>
  );
}

export default ProductCardSkeleton;