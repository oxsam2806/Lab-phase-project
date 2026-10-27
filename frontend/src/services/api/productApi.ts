import api from "./axiosInstance";
import type { Product, ProductFilters, ProductListResponse } from "../../types/product";

export type ProductQuery = Partial<ProductFilters> & { limit?: number };

const toParams = (query: ProductQuery) => {
  const params: Record<string, string | number> = {};
  if (query.search) params.search = query.search;
  if (query.category) params.category = query.category;
  if (query.minPrice) params.minPrice = query.minPrice;
  if (query.maxPrice) params.maxPrice = query.maxPrice;
  if (query.inStock) params.inStock = "true";
  if (query.sort) params.sort = query.sort;
  if (query.page) params.page = query.page;
  if (query.limit) params.limit = query.limit;
  return params;
};

export const productApi = {
  list: (query: ProductQuery, signal?: AbortSignal) =>
    api
      .get<ProductListResponse>("/products", { params: toParams(query), signal })
      .then((res) => res.data),

  getBySlug: (slug: string) =>
    api
      .get<{ product: Product }>(`/products/${encodeURIComponent(slug)}`)
      .then((res) => res.data.product),
};