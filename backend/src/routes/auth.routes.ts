import { Router } from "express";
import { register, login, logout, getMe } from "../controllers/auth.controller";
import { validate } from "../middleware/validate";
import { protect } from "../middleware/auth";
import { authLimiter } from "../middleware/rateLimiter";
import { registerSchema, loginSchema } from "../validators/auth.validator";

const router = Router();

router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/logout", logout);
router.get("/me", protect, getMe);

export default router;