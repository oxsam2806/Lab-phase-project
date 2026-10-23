import { Schema, model } from "mongoose";

export interface ICategory {
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true, trim: true, maxlength: 60 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, trim: true, maxlength: 300 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Category = model<ICategory>("Category", categorySchema);