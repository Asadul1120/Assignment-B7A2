import jwt, { type JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import config from "../config/index.js";
import { pool } from "../config/db.js";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access, token missing",
          errors: "Token missing",
        });
      }

      const decoded = jwt.verify(token, config.jwt_secret) as JwtPayload;

      if (!decoded.id || !decoded.role) {
        return res.status(401).json({
          success: false,
          message: "Invalid token payload",
        });
      }

      const userData = await pool.query(
        `
     SELECT * FROM users WHERE id=$1   
        `,
        [decoded.id],
      );
      const user = userData.rows[0];

      if (userData.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found!",
        });
      }

      req.user = decoded;

      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden!, insufficient permissions",

        });
      }

      next();
    } catch (error: unknown) {
      return res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : "Unauthorized access",
        errors: error,
      });
    }
  };
};
export default auth;
