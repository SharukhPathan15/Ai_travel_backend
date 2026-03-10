import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { generateAITrip } from "../controllers/ai.controller.js";

const router = express.Router();

router.post(
  "/generate-trip/:id",
  authMiddleware,
  generateAITrip
);

export default router;