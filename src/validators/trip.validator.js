import { z } from "zod";

export const createTripSchema = z.object({
  destination: z
    .string()
    .min(2, "Destination must be at least 2 characters"),

  days: z
    .number()
    .min(1, "Trip must be at least 1 day")
    .max(30, "Trip cannot exceed 30 days"),

  budgetType: z.enum(["Low", "Medium", "High"]),

  interests: z.array(z.string()).optional()
});