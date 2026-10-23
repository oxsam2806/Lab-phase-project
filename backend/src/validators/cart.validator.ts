import { z } from "zod";

const quantity = z.coerce
  .number()
  .int("Quantity must be a whole number")
  .min(1, "Quantity must be at least 1")
  .max(99, "You can add up to 99 of one item");

export const addToCartSchema = z.object({
  productId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid product"),
  quantity: quantity.default(1),
});

export const updateCartItemSchema = z.object({
  quantity,
});