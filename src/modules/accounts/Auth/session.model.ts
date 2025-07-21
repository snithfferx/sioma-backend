import { db } from "@DB/sqlite";
import { Session, TempSession } from "@DB/sqlite/schema";
import { eq } from "drizzle-orm";
import type { SessionSchema } from "@Types/accounts/session.schema";
export class SessionModel {
    constructor() { }

    async createSession(session: SessionSchema) {
        const exists = await db.select().from(Session).where(eq(Session.userId, session.userId));
        if (exists.length > 0) {
            // Soft delete
            await db.update(Session).set({ deletedAt: new Date() }).where(eq(Session.userId, session.userId));
        }
        const result = await db.insert(Session).values(session).returning();
        return result;
    }

    async getSession(userId: string) {
        const result = await db.select().from(Session).where(eq(Session.userId, userId)).get();
        return result;
    }

    async deleteSession(userId: string) {
        const result = await db.delete(Session).where(eq(Session.userId, userId));
        return result;
    }

    async updateSession(id: number, data: { token: string, expires: number }) {
        const result = await db.update(Session).set({
            token: data.token,
            expires: data.expires,
            updatedAt: new Date()
        }).where(eq(Session.id, id));
        return result;
    }

    async getTempSession(email: string) {
        return await db
            .select()
            .from(TempSession)
            .where(eq(TempSession.userId, email)).get();
    }

    async deleteTempSession(email: string) {
        return await db
            .delete(TempSession)
            .where(eq(TempSession.userId, email));
    }

    async createTempSession(user: string) {
        return await db
            .insert(TempSession)
            .values({
                userId: user,
                tempToken: '',
                tries: 0,
                expires: Math.floor(Date.now() / 1000) + (60 * 30),
                createdAt: new Date(),
                updatedAt: new Date()
            })
            .returning();
    }

    async updateTempSession(email: string, tempToken: string, tries: number) {
        return await db
            .update(TempSession)
            .set({
                tempToken: tempToken,
                tries: tries,
                updatedAt: new Date()
            })
            .where(eq(TempSession.userId, email));
    }
}