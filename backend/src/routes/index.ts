import { Router } from "express";
import authRoutes from "./auth.routes";
import categoryRoutes from "./category.routes";
import productRoutes from "./product.routes";
import cartRoutes from "./cart.routes";
import wishlistRoutes from "./wishlist.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/wishlist", wishlistRoutes);

export default router;