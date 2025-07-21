import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

console.info("HOST: " + process.env.MYSQL_DB_HOST);
console.info("NAME: " + process.env.MYSQL_DB_NAME);
console.info("USER: " + process.env.MYSQL_DB_USER);
console.info("PASS: " + process.env.MYSQL_DB_PASS);

export default defineConfig({
    out: './db/mysql',
    schema: './db/mysql/schema.ts',
    dialect: 'mysql',
    dbCredentials: {
        host: process.env.MYSQL_DB_HOST!,
        user: process.env.MYSQL_DB_USER!,
        password: process.env.MYSQL_DB_PASS!,
        database: process.env.MYSQL_DB_NAME!
    }
});