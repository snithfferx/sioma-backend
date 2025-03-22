import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

export default defineConfig({
    out: './db/mysql',
    schema: './db/mysql/schema.ts',
    dialect: 'mysql',
    dbCredentials: {
        host: process.env.MYSQL_HOST!,
        user: process.env.MYSQL_USER!,
        password: process.env.MYSQL_PASS!,
        database: process.env.MYSQL_NAME!
    }
});