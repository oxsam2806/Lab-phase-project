import { Router } from "express";
import { getWishlist, addToWishlist, removeFromWishlist } from "../controllers/wishlist.controller";
import { protect, authorizeRoles } from "../middleware/auth";
import { validateObjectIdParam } from "../middleware/validateObjectId";

const router = Router();

router.use(protect, authorizeRoles("customer"));

router.get("/", getWishlist);
router.post("/:productId", validateObjectIdParam("productId"), addToWishlist);
router.delete("/:productId", validateObjectIdParam("productId"), removeFromWishlist);

export default router;