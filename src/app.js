import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import tripRoutes from "./routes/trip.routes.js";
import aiRoutes from "./routes/ai.routes.js";

import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/ai", aiRoutes);

app.use(errorMiddleware);

export default app;