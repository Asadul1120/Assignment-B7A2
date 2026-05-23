import { Router } from "express";
import {
  signUpController,
  loginController,
  refreshTokenController,
} from "./auth.controller.js";

const router = Router();

router.post("/signup", signUpController);
router.post("/login", loginController);
router.post("/refresh-token", refreshTokenController);

export default router;
