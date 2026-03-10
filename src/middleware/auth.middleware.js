import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized"
    });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid token"
    });
  }
};

export default authMiddleware;