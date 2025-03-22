import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "@DB/sqlite/schema";
import "dotenv/config";

if (!process.env.DATABASE_NAME) {
    throw new Error("Missing Database Configuration");
}

const db_url = `${process.env.DATABASE_URL}${process.env.DATABASE_NAME}.db`;

export const client = createClient({ url: db_url || "file:./dev.db" });

export const db = drizzle(client, { schema });