import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema.js';
import { MYSQL_DB, MYSQL_HOST, MYSQL_PASS, MYSQL_USER } from '@Configs/constants';

if (!MYSQL_DB || !MYSQL_HOST || !MYSQL_USER || !MYSQL_PASS) {
    throw new Error('Missing Database Configuration');
}

// console.log(process.env.MYSQL_PASS);

const connection = await mysql.createConnection({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASS,
    database: MYSQL_DB,
});

export const db = drizzle(connection, { schema, mode: 'default' });