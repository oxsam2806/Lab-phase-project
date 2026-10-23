import type { Types } from "mongoose";
import { Cart } from "../models/Cart";

interface PopulatedProduct {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  price: number;
  stock: number;
  isActive: boolean;
  images: { url: string }[];
}

const round = (value: number) => Math.round(value * 100) / 100;

export const buildCartResponse = async (userId: string) => {
  const cart = await Cart.findOne({ user: userId })
    .populate<{ items: { product: PopulatedProduct | null; quantity: number }[] }>(
      "items.product",
      "name slug price stock isActive images"
    )
    .lean();

  if (!cart) {
    return { items: [], itemCount: 0, subtotal: 0 };
  }

  const validItems = cart.items.filter(
    (item): item is { product: PopulatedProduct; quantity: number } =>
      item.product !== null && item.product.isActive
  );

  if (validItems.length !== cart.items.length) {
    await Cart.updateOne(
      { user: userId },
      { $set: { items: validItems.map((item) => ({ product: item.product._id, quantity: item.quantity })) } }
    );
  }

  const items = validItems.map(({ product, quantity }) => ({
    product: {
      _id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      price: product.price,
      stock: product.stock,
      image: product.images[0]?.url ?? null,
    },
    quantity,
    lineTotal: round(product.price * quantity),
    exceedsStock: quantity > product.stock,
  }));

  return {
    items,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: round(items.reduce((sum, item) => sum + item.lineTotal, 0)),
  };
};