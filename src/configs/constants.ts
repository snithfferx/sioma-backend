import "dotenv/config";

export const APP_PORT = process.env.APP_PORT;
export const APP_HOST = process.env.APP_HOST;
export const APP_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRATION = process.env.JWT_EXPIRES_IN;
// MYSQL DB
export const MYSQL_HOST = process.env.MYSQL_DB_HOST;
export const MYSQL_PORT = process.env.MYSQL_DB_PORT;
export const MYSQL_DB = process.env.MYSQL_DB_NAME;
export const MYSQL_USER = process.env.MYSQL_DB_USER;
export const MYSQL_PASS = process.env.MYSQL_DB_PASS;
// LOCAL DB
export const DB_NAME = process.env.LDB_NAME;
export const DB_HOST = process.env.LDB_HOST;
export const DB_USER = process.env.LDB_USER;
export const DB_PASS = process.env.LDB_PASSWORD;