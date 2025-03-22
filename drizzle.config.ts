import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

const db_url = `${process.env.DATABASE_URL}${process.env.DATABASE_NAME}.db`;

export default defineConfig({
    out: './db/sqlite',
    schema: './db/sqlite/schema.ts',
    dialect: 'sqlite',
    dbCredentials: {
        url: db_url!,
    },
});