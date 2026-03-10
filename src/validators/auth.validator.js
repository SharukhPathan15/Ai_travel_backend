import { z } from "zod";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters"),

    email: z
      .string()
      .email("Invalid email address"),

    password: z
      .string()
      .regex(
        passwordRegex,
        "Password must contain uppercase, lowercase, number and special character"
      ),

    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});