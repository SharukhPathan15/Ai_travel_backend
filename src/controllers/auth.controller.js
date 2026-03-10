import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";

export const registerUser = asyncHandler(async (req, res) => {

  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const error = new Error("User already exists");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    password: hashedPassword
  });

  const token = generateToken(user._id);

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "none",
    secure: true
  });

  res.status(201).json({
    success: true,
    data: user
  });
});

export const loginUser = asyncHandler(async (req, res) => {

  const { email, password } = req.body;

  const user = await User.findOne({ email });

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

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "none",
    secure: true
  });

  res.json({
    success: true,
    data: user
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
  res.clearCookie("token");

  res.json({
    success: true,
    message: "Logged out successfully"
  });
};