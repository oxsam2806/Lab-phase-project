import { Schema, model, type Types } from "mongoose";

export interface ICartItem {
  product: Types.ObjectId;
  quantity: number;
}

export interface ICart {
  user: Types.ObjectId;
  items: ICartItem[];
}

const cartItemSchema = new Schema<ICartItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1, max: 99 },
  },
  { _id: false }
);

const cartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: { type: [cartItemSchema], default: [] },
  },
  { timestamps: true }
);

export const Cart = model<ICart>("Cart", cartSchema);