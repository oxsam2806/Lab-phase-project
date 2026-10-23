import { Schema, model, type Types } from "mongoose";

export interface IProductImage {
  url: string;
}

export interface IProduct {
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  category: Types.ObjectId;
  seller: Types.ObjectId;
  images: IProductImage[];
  brand?: string;
  sku?: string;
  isActive: boolean;
  ratingAverage: number;
  ratingCount: number;
}

const imageSchema = new Schema<IProductImage>({ url: { type: String, required: true } }, { _id: false });

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true, maxlength: 3000 },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
    images: { type: [imageSchema], default: [] },
    brand: { type: String, trim: true, maxlength: 60 },
    sku: { type: String, trim: true, maxlength: 60 },
    isActive: { type: Boolean, default: true },
    ratingAverage: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

productSchema.index({ category: 1, price: 1 });
productSchema.index({ seller: 1, createdAt: -1 });
productSchema.index({ isActive: 1, createdAt: -1 });

export const Product = model<IProduct>("Product", productSchema);