import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
};

export const registerUser = asyncHandler(async (req, res) => {

  const { name, email, password } = req.body;

  const normalizedEmail = email.toLowerCase();

  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    const error = new Error("User already exists");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    name,
    email: normalizedEmail,
    password: hashedPassword
  });

  const token = generateToken(user._id);

  res.cookie("token", token, cookieOptions);

  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;

  res.status(201).json({
    success: true,
    data: userWithoutPassword
  });
});


export const loginUser = asyncHandler(async (req, res) => {

  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user._id);

  res.cookie("token", token, cookieOptions);

  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;

  res.json({
    success: true,
    data: userWithoutPassword
  });
});


export const getCurrentUser = asyncHandler(async (req, res) => {

  const user = await User.findById(req.user.userId).select("-password");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  res.json({
    success: true,
    data: user
  });

});


export const logoutUser = (req, res) => {

  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
  });

  res.json({
    success: true,
    message: "Logged out successfully"
  });
};