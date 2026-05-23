import bcrypt from "bcrypt";
import { pool } from "../../config/db.js";
import config from "../../config/index.js";
import type { IUser } from "./auth.interface.js";
import jwt from "jsonwebtoken";

const sigupService = async (payload: IUser) => {
  const { name, email, password, role } = payload;

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users 
    (name, email, password, role) 
    VALUES ($1, $2, $3, COALESCE($4,'contributor')) 
    RETURNING *`,
    [name, email, hashedPassword, role],
  );

  delete result.rows[0].password;
  return result.rows[0];
};

const loginService = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);
  if (result.rows.length === 0) {
    throw new Error("User not found");
  }
  const user = result.rows[0];
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const payload = {
    id: user.id as number,
    name: user.name as string,
    email: user.email as string,
    role: user.role as string,
  };
  const accessToken = jwt.sign(payload, config.jwt_secret, { expiresIn: "1h" });

  const refreshToken = jwt.sign(payload, config.refresh_token_secret, {
    expiresIn: "7d",
  });

  return { token: accessToken, user: payload, refreshToken };
};

const generateFreshToken = async (token: string) => {
  if (!token) {
    throw new Error("Unauthorized");
  }

  const decoded = jwt.verify(token, config.refresh_token_secret as string) as jwt.JwtPayload;

  const userData = await pool.query(
    `
     SELECT * FROM users WHERE email=$1   
        `,
    [decoded.email],
  );

  const user = userData.rows[0];

  if (userData.rows.length === 0) {
    throw new Error("User not found!!");
  }


  const jwtpayload = {
    id: user.id as number,
    name: user.name as string,
    role: user.role as string,
    email: user.email as string,
  };

  const accessToken = jwt.sign(jwtpayload, config.jwt_secret as string, {
    expiresIn: "1d",
  });

  return { accessToken };
};
export { sigupService, loginService, generateFreshToken };
