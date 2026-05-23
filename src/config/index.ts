import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  port: process.env.PORT,
  connection_string: process.env.CONNECTION_STRING as string,
  jwt_secret: process.env.JWT_SECRET as string,
  refresh_token_secret: process.env.REFRESH_TOKEN_SECRET as string,

};

export default config;
