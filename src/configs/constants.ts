import "dotenv/config";

// APP
export const APP_AUTHOR = process.env.APP_AUTHOR;
export const APP_FULL_NAME = process.env.APP_FULL_NAME;
export const APP_NAME = process.env.APP_NAME;
export const APP_VERSION = process.env.APP_VERSION;
export const APP_SHORT_VERSION = process.env.APP_SHORT_VERSION;
export const APP_LANGUAGE = process.env.APP_LANGUAGE;
export const APP_DESC = process.env.APP_DESCRIPTION;
export const APP_LOGO = process.env.APP_LOGO;
export const APP_LOGO_MINI = process.env.APP_LOGO_MINI;
export const APP_DEBUG = process.env.APP_DEBUG;
export const APP_KEY = process.env.APP_KEY;
export const APP_URI = `http://${process.env.APP_HOST_NAME}:${process.env.APP_HOST_PORT}`;
export const APP_TIMEZONE = process.env.APP_TIMEZONE;
export const APP_DATE_FORMAT = process.env.APP_DATE_FORMAT;
export const APP_TIME_FORMAT = process.env.APP_TIME_FORMAT;
export const APP_AUTH = process.env.APP_AUTH;
export const APP_SECRET = process.env.APP_SECRET;
export const APP_REDIRECT_URI = `${APP_URI}/${process.env.APP_REDIRECT_URI}`;
export const APP_PORT = process.env.APP_HOST_PORT;
export const APP_HOST = process.env.APP_HOST_NAME;
export const JWT_EXPIRATION = process.env.JWT_EXPIRES_IN;

// SITE
export const SITE_NAME = process.env.SITE_NAME || process.env.APP_NAME;
export const SITE_AUTHOR = process.env.APP_AUTHOR;
export const SITE_DESC = process.env.APP_DESCRIPTION;
export const SITE_LOGO = process.env.APP_LOGO;
export const SITE_LOGO_MINI = process.env.APP_LOGO_MINI;
export const SITE_DOMAIN = process.env.SITE_DOMAIN || process.env.APP_HOST_NAME;
export const REDIRECT_URI = `${SITE_DOMAIN}/${process.env.APP_REDIRECT_URI}`;
// DB
export const DB_NAME = process.env.DATABASE_NAME;
export const DB_HOST = process.env.DATABASE_HOST;
export const DB_USER = process.env.DATABASE_USER;
export const DB_PASS = process.env.DATABASE_PASSWORD;
// MYSQL DB
export const MYSQL_HOST = process.env.MYSQL_DB_HOST;
export const MYSQL_PORT = process.env.MYSQL_DB_PORT;
export const MYSQL_NAME = process.env.MYSQL_DB_NAME;
export const MYSQL_USER = process.env.MYSQL_DB_USER;
export const MYSQL_PASS = process.env.MYSQL_DB_PASS;
// JWT
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_KEY = process.env.JWT_KEY;
export const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || "7d";
export const CSRF_TOKEN_NAME = 'csrf-token';
// Shopify
export const SHOPIFY_CLIENT = process.env.SHOPIFY_CLIENT_ID;
export const SHOPIFY_SECRET = process.env.SHOPIFY_SECRET_KEY;
export const SHOPIFY_SHOP = process.env.SHOPIFY_SHOP_NAME;
export const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;
export const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION;
export const SHOPIFY_SCOPES = process.env.SHOPIFY_SCOPES;
// E-mail
export const SMTP_HOST = process.env.APP_SMTP_HOST;
export const SMTP_PORT = process.env.APP_SMTP_PORT;
export const SMTP_USER = process.env.APP_SMTP_USER;
export const SMTP_PASS = process.env.APP_SMTP_PASS;
export const SMTP_MAIL = process.env.APP_SMTP_MAIL;
export const SMTP_REPL = process.env.APP_SMTP_REPL || process.env.APP_SMTP_MAIL;
