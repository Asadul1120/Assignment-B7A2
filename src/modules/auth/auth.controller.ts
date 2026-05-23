import type { Request, Response } from "express";
import { generateFreshToken, loginService, sigupService } from "./auth.service";

const signUpController = async (req: Request, res: Response) => {
  try {
    const result = await sigupService(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "User registration failed",
      error: error.message,
    });
  }
};

const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { token, user, refreshToken } = await loginService(email, password);
   
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { token: token, user },
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message, error });
  }
};

const refreshTokenController = async (req: Request, res: Response) => {
  try {
    const result = await generateFreshToken(req.cookies.refreshToken);
    res.status(200).json({
      success: true,
      message: "Acess token generated!",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

export { signUpController, loginController, refreshTokenController };
