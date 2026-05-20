import express from "express";
import type { Request, Response } from "express";

const app = express();

//Built-in Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "DevPulse Server Running",
  });
});

export default app;
