import type { Product } from "./product";

export interface CartProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  image: string | null;
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
  lineTotal: number;
  exceedsStock: boolean;
}

export interface Cart {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
}

export interface CartResponse {
  cart: Cart;
  message: string;
}

export interface WishlistResponse {
  products: Product[];
  message: string;
}