import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  GROQ_API_KEY: process.env.GROQ_API_KEY
};