import { DB_NAME, DB_HOST } from '@App/configs/constants';
import { drizzle } from 'drizzle-orm/libsql/node';

const database = `${DB_HOST}/${DB_NAME}.db`;
// const database = `${process.env.DATABASE_HOST}/prod/${process.env.DATABASE_NAME}.db`;

export const db = drizzle({
	connection: {
		url: database
	}
});
