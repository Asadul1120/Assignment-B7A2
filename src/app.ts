import express from "express";
import type { Request, Response } from "express";
import authRoutes from "./modules/auth/auth.route.js";
import issuesRoutes from "./modules/issues/issues.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

//Built-in Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to DevPulse API",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/issues", issuesRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;
