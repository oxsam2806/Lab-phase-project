import type { Request, Response } from "express";
import { Category } from "../models/Category";
import { Product } from "../models/Product";
import { ApiError } from "../utils/ApiError";
import { slugify } from "../utils/slugify";

export const listCategories = async (_req: Request, res: Response) => {
  const categories = await Category.find({ isActive: true }).sort({ name: 1 });
  res.json({ categories });
};

export const createCategory = async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const slug = slugify(name);

  if (await Category.exists({ slug })) {
    throw new ApiError(409, "A category with this name already exists");
  }

  const category = await Category.create({ name, slug, description });
  res.status(201).json({ category, message: "Category created" });
};

export const updateCategory = async (req: Request, res: Response) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new ApiError(404, "Category not found");

  category.set(req.body);
  if (req.body.name) category.slug = slugify(req.body.name);
  await category.save();

  res.json({ category, message: "Category updated" });
};

export const deleteCategory = async (req: Request, res: Response) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new ApiError(404, "Category not found");

  if (await Product.exists({ category: category._id })) {
    throw new ApiError(400, "Move or delete the products in this category first");
  }

  await category.deleteOne();
  res.json({ message: "Category deleted" });
};