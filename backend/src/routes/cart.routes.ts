import { Router } from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cart.controller";
import { protect, authorizeRoles } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { validateObjectIdParam } from "../middleware/validateObjectId";
import { addToCartSchema, updateCartItemSchema } from "../validators/cart.validator";

const router = Router();

router.use(protect, authorizeRoles("customer"));

router.get("/", getCart);
router.post("/items", validate(addToCartSchema), addToCart);
router.put(
  "/items/:productId",
  validateObjectIdParam("productId"),
  validate(updateCartItemSchema),
  updateCartItem
);
router.delete("/items/:productId", validateObjectIdParam("productId"), removeCartItem);
router.delete("/", clearCart);

export default router;