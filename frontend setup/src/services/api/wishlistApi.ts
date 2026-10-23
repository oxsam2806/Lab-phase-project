import api from "./axiosInstance";
import type { Product } from "../../types/product";
import type { WishlistResponse } from "../../types/cart";

export const wishlistApi = {
  get: () => api.get<{ products: Product[] }>("/wishlist").then((res) => res.data.products),

  add: (productId: string) =>
    api.post<WishlistResponse>(`/wishlist/${productId}`).then((res) => res.data),

  remove: (productId: string) =>
    api.delete<WishlistResponse>(`/wishlist/${productId}`).then((res) => res.data),
};