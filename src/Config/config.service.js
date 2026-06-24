import dotenv from "dotenv";
import { resolve } from "node:path";

const envPaths = {
  development: "dev.env",
  production: "prod.env",
};

dotenv.config({ path: resolve(`./src/Config/${envPaths.development}`) });

export const DB_URI = process.env.DB_URI;
export const SERVER_URI = process.env.SERVER_URI;
export const SERVER_URL = process.env.SERVER_URL;
export const SERVER_PORT = process.env.SERVER_PORT;
export const JWT_KEY = process.env.JWT_KEY;
export const CRYPTO_KEY = process.env.CRYPTO_KEY;

export const CRYPTO_ALGORITHM = process.env.CRYPTO_ALGORITHM;
export const ENC_KEY = process.env.ENC_KEY;


// Tokens
export const ACCESS_TOKEN_USER_SECRET = process.env.ACCESS_TOKEN_USER_SECRET;
export const REFRESH_TOKEN_USER_SECRET = process.env.REFRESH_TOKEN_USER_SECRET;
export const ACCESS_TOKEN_USER_EXPIRES_IN = Number(process.env.ACCESS_TOKEN_USER_EXPIRES_IN);
export const REFRESH_TOKEN_USER_EXPIRES_IN = Number(process.env.REFRESH_TOKEN_USER_EXPIRES_IN);

export const ACCESS_TOKEN_ADMIN_SECRET = process.env.ACCESS_TOKEN_ADMIN_SECRET;
export const REFRESH_TOKEN_ADMIN_SECRET = process.env.REFRESH_TOKEN_ADMIN_SECRET;
export const ACCESS_TOKEN_ADMIN_EXPIRES_IN = Number(process.env.ACCESS_TOKEN_ADMIN_EXPIRES_IN);
export const REFRESH_TOKEN_ADMIN_EXPIRES_IN = Number(process.env.REFRESH_TOKEN_ADMIN_EXPIRES_IN);


export const CLIENT_ID = process.env.CLIENT_ID;