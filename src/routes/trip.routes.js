import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createTripSchema } from "../validators/trip.validator.js";

import {
  createTrip,
  getTrips,
  getTrip,
  deleteTrip
} from "../controllers/trip.controller.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validate(createTripSchema),
  createTrip
);

router.get("/", authMiddleware, getTrips);

router.get("/:id", authMiddleware, getTrip);

router.delete("/:id", authMiddleware, deleteTrip);

export default router;