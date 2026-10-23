import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().trim().min(2, "Category name must be at least 2 characters").max(60),
  description: z.string().trim().max(300).optional(),
});

export const updateCategorySchema = createCategorySchema.partial().extend({
  isActive: z.boolean().optional(),
});