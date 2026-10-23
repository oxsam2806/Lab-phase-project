import { Schema, model, type Model, type HydratedDocument } from "mongoose";
import bcrypt from "bcryptjs";

export type Role = "customer" | "seller" | "admin";
export type AccountStatus = "active" | "pending" | "suspended";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: Role;
  status: AccountStatus;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IUserMethods {
  comparePassword(candidate: string): Promise<boolean>;
}

type UserModel = Model<IUser, object, IUserMethods>;
export type UserDocument = HydratedDocument<IUser, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ["customer", "seller", "admin"], default: "customer" },
    status: { type: String, enum: ["active", "pending", "suspended"], default: "active" },
    phone: { type: String, trim: true },
  },
  { timestamps: true }
);

userSchema.index({ role: 1, status: 1 });

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export const User = model<IUser, UserModel>("User", userSchema);