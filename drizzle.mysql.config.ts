import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

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