import type { Request, Response } from "express";
import { Cart } from "../models/Cart";
import { Product } from "../models/Product";
import { ApiError } from "../utils/ApiError";
import { buildCartResponse } from "../services/cart.service";

const findPurchasableProduct = async (productId: string, userId: string) => {
  const product = await Product.findOne({ _id: productId, isActive: true });
  if (!product) throw new ApiError(404, "Product not found");
  if (product.seller.toString() === userId) {
    throw new ApiError(400, "You can't buy your own product");
  }
  return product;
};

const stockMessage = (stock: number) =>
  stock === 0 ? "This product is out of stock" : `Only ${stock} left in stock`;

export const getCart = async (req: Request, res: Response) => {
  res.json({ cart: await buildCartResponse(req.user!.id) });
};

export const addToCart = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { productId, quantity } = req.body as { productId: string; quantity: number };

  const product = await findPurchasableProduct(productId, userId);

  const cart = (await Cart.findOne({ user: userId })) ?? new Cart({ user: userId, items: [] });
  const existing = cart.items.find((item) => item.product.toString() === productId);
  const newQuantity = (existing?.quantity ?? 0) + quantity;

  if (newQuantity > product.stock) throw new ApiError(400, stockMessage(product.stock));
  if (newQuantity > 99) throw new ApiError(400, "You can add up to 99 of one item");

  if (existing) {
    existing.quantity = newQuantity;
  } else {
    cart.items.push({ product: product._id, quantity });
  }
  await cart.save();

  res.json({ cart: await buildCartResponse(userId), message: `${product.name} added to cart` });
};

export const updateCartItem = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const productId = req.params.productId as string;
  const { quantity } = req.body as { quantity: number };

  const product = await findPurchasableProduct(productId, userId);
  if (quantity > product.stock) throw new ApiError(400, stockMessage(product.stock));

  const cart = await Cart.findOne({ user: userId });
  const item = cart?.items.find((entry) => entry.product.toString() === productId);
  if (!cart || !item) throw new ApiError(404, "Item is not in your cart");

  item.quantity = quantity;
  await cart.save();

  res.json({ cart: await buildCartResponse(userId), message: "Cart updated" });
};

export const removeCartItem = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  await Cart.updateOne({ user: userId }, { $pull: { items: { product: req.params.productId } } });
  res.json({ cart: await buildCartResponse(userId), message: "Item removed from cart" });
};

export const clearCart = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  await Cart.updateOne({ user: userId }, { $set: { items: [] } });
  res.json({ cart: await buildCartResponse(userId), message: "Cart cleared" });
};