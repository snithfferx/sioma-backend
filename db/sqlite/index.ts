import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "@DB/sqlite/schema";
import { DB_NAME, DB_HOST } from "@Configs/constants";

if (!DB_NAME || !DB_HOST) {
    throw new Error("Missing Database Configuration");
}

const db_url = `${DB_HOST}${DB_NAME}.db`;

export const client = createClient({ url: db_url || "file:./dev.db" });

export const db = drizzle(client, { schema });