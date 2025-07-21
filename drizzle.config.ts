import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

console.info(process.env.LDB_HOST);
console.info(process.env.LDB_NAME);

const db_url = `${process.env.LDB_HOST}${process.env.LDB_NAME}.db`;

export default defineConfig({
    out: './db/sqlite',
    schema: './db/sqlite/schema.ts',
    dialect: 'sqlite',
    dbCredentials: {
        url: db_url!,
    },
});