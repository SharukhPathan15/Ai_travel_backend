import express from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser
} from "../controllers/auth.controller.js";

import { validate } from "../middleware/validate.middleware.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { authRateLimiter } from "../middleware/rateLimit.middleware.js";

const router = express.Router();

router.post(
  "/register",
  authRateLimiter,
  validate(registerSchema),
  registerUser
);

router.post(
  "/login",
  authRateLimiter,
  validate(loginSchema),
  loginUser
);

router.get("/me", authMiddleware, getCurrentUser);

router.post("/logout", authMiddleware, logoutUser);

export default router;