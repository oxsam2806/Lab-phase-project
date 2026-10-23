import type { Request } from "express";
import type { Response } from "express";
import { Product } from "../models/Product";
import { Category } from "../models/Category";
import { ApiError } from "../utils/ApiError";
import { uniqueSlug } from "../utils/slugify";
import { escapeRegex } from "../utils/escapeRegex";
import { deleteFiles } from "../utils/files";
import { getUploadedFiles, toImageUrl } from "../middleware/upload";
import { productQuerySchema } from "../validators/product.validator";

const sortOptions: Record<string, Record<string, 1 | -1>> = {
  newest: { createdAt: -1 },
  price_asc: { price: 1 },
  price_desc: { price: -1 },
  rating: { ratingAverage: -1 },
  name: { name: 1 },
};

const findManageableProduct = async (req: Request) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, "Product not found");

  const isOwner = product.seller.toString() === req.user!.id;
  if (req.user!.role !== "admin" && !isOwner) {
    throw new ApiError(403, "You can only manage your own products");
  }
  return product;
};

export const listProducts = async (req: Request, res: Response) => {
  const parsed = productQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues[0].message);
  }
  const { search, category, minPrice, maxPrice, inStock, sort, page, limit } = parsed.data;

  const filter: Record<string, unknown> = { isActive: true };

  if (search) {
    filter.name = { $regex: escapeRegex(search), $options: "i" };
  }

  if (category) {
    const found = await Category.findOne({ slug: category });
    if (!found) {
      return res.json({ products: [], page, totalPages: 0, total: 0 });
    }
    filter.category = found._id;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    const price: Record<string, number> = {};
    if (minPrice !== undefined) price.$gte = minPrice;
    if (maxPrice !== undefined) price.$lte = maxPrice;
    filter.price = price;
  }

  if (inStock === "true") {
    filter.stock = { $gt: 0 };
  }

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort(sortOptions[sort])
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("category", "name slug")
      .populate("seller", "name"),
    Product.countDocuments(filter),
  ]);

  res.json({ products, page, totalPages: Math.ceil(total / limit), total });
};

export const getProductBySlug = async (req: Request, res: Response) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true })
    .populate("category", "name slug")
    .populate("seller", "name");

  if (!product) throw new ApiError(404, "Product not found");
  res.json({ product });
};

export const getMyProducts = async (req: Request, res: Response) => {
  const products = await Product.find({ seller: req.user!.id })
    .sort({ createdAt: -1 })
    .populate("category", "name slug");
  res.json({ products });
};

export const createProduct = async (req: Request, res: Response) => {
  const files = getUploadedFiles(req.files);
  if (files.length === 0) {
    throw new ApiError(400, "Add at least one product image");
  }

  if (!(await Category.exists({ _id: req.body.category }))) {
    throw new ApiError(400, "Choose a valid category");
  }

  const product = await Product.create({
    ...req.body,
    slug: uniqueSlug(req.body.name),
    seller: req.user!.id,
    images: files.map((file) => ({ url: toImageUrl(file) })),
  });

  res.status(201).json({ product, message: "Product created" });
};

export const updateProduct = async (req: Request, res: Response) => {
  const product = await findManageableProduct(req);
  const files = getUploadedFiles(req.files);

  if (req.body.category && !(await Category.exists({ _id: req.body.category }))) {
    throw new ApiError(400, "Choose a valid category");
  }

  const oldImages = product.images.map((image) => image.url);
  product.set(req.body);
  if (files.length) {
    product.set("images", files.map((file) => ({ url: toImageUrl(file) })));
  }
  await product.save();

  if (files.length) {
    await deleteFiles(oldImages);
  }

  res.json({ product, message: "Product updated" });
};

export const deleteProduct = async (req: Request, res: Response) => {
  const product = await findManageableProduct(req);
  const images = product.images.map((image) => image.url);

  await product.deleteOne();
  await deleteFiles(images);

  res.json({ message: "Product deleted" });
};