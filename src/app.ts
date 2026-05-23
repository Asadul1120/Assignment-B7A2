import express from "express";
import type { Request, Response } from "express";
import authRoutes from "./modules/auth/auth.route.js";
import issuesRoutes from "./modules/issues/issues.route.js";
import cookieParser from "cookie-parser";

const app = express();

//Built-in Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "DevPulse Server Running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/issues", issuesRoutes);

export default app;
