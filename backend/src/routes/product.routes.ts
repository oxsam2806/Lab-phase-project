import { Router } from "express";
import {
  listProducts,
  getProductBySlug,
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
import { protect, authorizeRoles, requireApprovedSeller } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { uploadProductImages } from "../middleware/upload";
import { createProductSchema, updateProductSchema } from "../validators/product.validator";

const router = Router();

router.get("/", listProducts);
router.get("/mine", protect, authorizeRoles("seller"), getMyProducts);
router.get("/:slug", getProductBySlug);

router.post(
  "/",
  protect,
  authorizeRoles("seller"),
  requireApprovedSeller,
  uploadProductImages,
  validate(createProductSchema),
  createProduct
);

router.put(
  "/:id",
  protect,
  authorizeRoles("seller", "admin"),
  requireApprovedSeller,
  uploadProductImages,
  validate(updateProductSchema),
  updateProduct
);

router.delete("/:id", protect, authorizeRoles("seller", "admin"), requireApprovedSeller, deleteProduct);

export default router;