import { Router } from "express";
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller";
import { protect, authorizeRoles } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createCategorySchema, updateCategorySchema } from "../validators/category.validator";

const router = Router();

router.get("/", listCategories);
router.post("/", protect, authorizeRoles("admin"), validate(createCategorySchema), createCategory);
router.put("/:id", protect, authorizeRoles("admin"), validate(updateCategorySchema), updateCategory);
router.delete("/:id", protect, authorizeRoles("admin"), deleteCategory);

export default router;