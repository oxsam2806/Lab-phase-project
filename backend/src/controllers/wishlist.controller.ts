import type { Request, Response } from "express";
import { Wishlist } from "../models/Wishlist";
import { Product } from "../models/Product";
import { ApiError } from "../utils/ApiError";

const buildWishlistResponse = async (userId: string) => {
  const wishlist = await Wishlist.findOne({ user: userId })
    .populate<{ products: { isActive: boolean }[] }>({
      path: "products",
      select: "name slug price stock images category isActive ratingAverage ratingCount createdAt",
      populate: { path: "category", select: "name slug" },
    })
    .lean();

  return (wishlist?.products ?? []).filter((product) => product && product.isActive);
};

export const getWishlist = async (req: Request, res: Response) => {
  res.json({ products: await buildWishlistResponse(req.user!.id) });
};

export const addToWishlist = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const productId = req.params.productId as string;

  if (!(await Product.exists({ _id: productId, isActive: true }))) {
    throw new ApiError(404, "Product not found");
  }

  await Wishlist.updateOne(
    { user: userId },
    { $addToSet: { products: productId } },
    { upsert: true }
  );

  res.json({ products: await buildWishlistResponse(userId), message: "Saved to wishlist" });
};

export const removeFromWishlist = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  await Wishlist.updateOne({ user: userId }, { $pull: { products: req.params.productId } });
  res.json({ products: await buildWishlistResponse(userId), message: "Removed from wishlist" });
};