export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface ProductImage {
  url: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  category: Pick<Category, "_id" | "name" | "slug">;
  seller: { _id: string; name: string };
  images: ProductImage[];
  brand?: string;
  sku?: string;
  ratingAverage: number;
  ratingCount: number;
  createdAt: string;
}

export type SortOption = "newest" | "price_asc" | "price_desc" | "rating" | "name";

export interface ProductFilters {
  search: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  inStock: boolean;
  sort: SortOption;
  page: number;
}

export interface ProductListResponse {
  products: Product[];
  page: number;
  totalPages: number;
  total: number;
}