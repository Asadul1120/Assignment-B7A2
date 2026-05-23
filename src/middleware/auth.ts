import jwt, { type JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import config from "../config";
import { pool } from "../config/db";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access, token missing",
        });
      }

      const decoded = jwt.verify(token, config.jwt_secret) as JwtPayload;

      const userData = await pool.query(
        `
     SELECT * FROM users WHERE email=$1   
        `,
        [decoded.email],
      );
      const user = userData.rows[0];

      if (userData.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: "User not found!",
        });
      }

      req.user = decoded;

      if (roles.length && !roles.includes(user.role)) {
        res.status(403).json({
          success: false,
          message: "Forbidden, insufficient permissions",
        });
      }

      next();
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : "Unauthorized access",
      });
    }
  };
};
export default auth;
