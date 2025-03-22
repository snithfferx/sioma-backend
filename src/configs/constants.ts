import "dotenv/config";

export const APP_PORT = process.env.APP_PORT;
export const APP_HOST = process.env.APP_HOST;
export const APP_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRATION = process.env.JWT_EXPIRES_IN;