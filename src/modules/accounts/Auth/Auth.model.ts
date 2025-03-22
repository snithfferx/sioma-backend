import { LoginRequest } from '@Schemas/Auth.schema';
import { db } from '@DB/sqlite';
import { Users, Session } from '@DB/sqlite/schema';
import { eq, or } from 'drizzle-orm';

export class AuthModel {
    constructor() { }

    async findUser(email: string, user: string) {
        return await db
            .select()
            .from(Users)
            .where(or(eq(Users.email, email), eq(Users.userName, user)))
            .limit(1);
    }

    async getUserByEmail(email: string) {
        return await db
            .select({
                id: Users.id,
                email: Users.email,
                userName: Users.userName,
                password: Users.password
            })
            .from(Users)
            .where(eq(Users.email, email));
    }

    async getUserByName(user: string) {
        return await db
            .select({
                id: Users.id,
                email: Users.email,
                userName: Users.userName,
                password: Users.password
            })
            .from(Users)
            .where(eq(Users.userName, user));
    }

    async getUserById(id: number) {
        const user = await db
            .select({
                id: Users.id,
                email: Users.email,
                userName: Users.userName,
                password: Users.password
            })
            .from(Users)
            .where(eq(Users.id, id))
            .get();
        return user;
    }

    async addUser(data: LoginRequest) {
        if (!data.email || !data.password || !data.userName) {
            return null;
        }
        return await db
            .insert(Users)
            .values({
                email: data.email,
                password: data.password,
                userName: data.userName
            })
            .returning();
    }
}