import api from "./axiosInstance";
import type { Cart, CartResponse } from "../../types/cart";

export const cartApi = {
  get: () => api.get<{ cart: Cart }>("/cart").then((res) => res.data.cart),

  add: (productId: string, quantity: number) =>
    api.post<CartResponse>("/cart/items", { productId, quantity }).then((res) => res.data),

  update: (productId: string, quantity: number) =>
    api.put<CartResponse>(`/cart/items/${productId}`, { quantity }).then((res) => res.data),

  remove: (productId: string) =>
    api.delete<CartResponse>(`/cart/items/${productId}`).then((res) => res.data),

  clear: () => api.delete<CartResponse>("/cart").then((res) => res.data),
};