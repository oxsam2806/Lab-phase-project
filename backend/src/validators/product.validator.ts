import { z } from "zod";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Choose a valid category");

const booleanField = z.union([
  z.boolean(),
  z.enum(["true", "false"]).transform((value) => value === "true"),
]);

export const createProductSchema = z.object({
  name: z.string().trim().min(2, "Product name must be at least 2 characters").max(120),
  description: z.string().trim().min(10, "Description must be at least 10 characters").max(3000),
  price: z.coerce.number().positive("Price must be greater than 0").max(10_000_000),
  stock: z.coerce.number().int("Stock must be a whole number").min(0, "Stock cannot be negative"),
  category: objectId,
  brand: z.string().trim().max(60).optional(),
  sku: z.string().trim().max(60).optional(),
  isActive: booleanField.optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  category: z.string().trim().max(80).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  inStock: z.enum(["true", "false"]).optional(),
  sort: z.enum(["newest", "price_asc", "price_desc", "rating", "name"]).default("newest"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});