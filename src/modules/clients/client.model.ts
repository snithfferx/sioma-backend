import { db } from "@DB/sqlite";
import { Client, ClientContact } from "@DB/sqlite/schema";
import { asc, count, desc, eq, like } from "drizzle-orm";
import { v4 as uuidv4 } from 'uuid';

export class ClientModel {
    async create(data: {
        name: string;
        avatar: string | null;
        increase: number;
        discount: number;
        status: number;
    }) {
        const result = await db.insert(Client).values({
            id: await this.generateUuid(),
            name: data.name,
            avatar: data.avatar,
            increase: data.increase,
            discount: data.discount,
            status: data.status
        }).returning();
        return result ? result[0] : null;
    }
    async update(id: string, data: {
        name: string;
        avatar: string | null;
        increase: number;
        discount: number;
        status: number;
    }) {
        return await db.update(Client).set(data).where(eq(Client.id, id)).returning();
    }
    async delete(id: string) {
        return await db.delete(Client).where(eq(Client.id, id));
    }
    async get(id: string) {
        const result = await db.select().from(Client)
            .where(eq(Client.id, id)).get();
        if (result) {
            return result;
        }
        return null;
    }
    async getAll(terms: string | null, page: number, limit: number, sort: string) {
        const offset = page > 1 ? page * limit - 1 : 1;
        if (terms) {
            if (sort !== 'asc') {
                return await db.select().from(Client).where(like(Client.name, `%${terms}%`)).limit(limit).offset(offset).orderBy(desc(Client.name));
            }
            return await db.select().from(Client).where(like(Client.name, `%${terms}%`)).limit(limit).offset(offset).orderBy(asc(Client.name));
        } else {
            if (sort !== 'asc') {
                return await db.select().from(Client).limit(limit).offset(offset).orderBy(desc(Client.name));
            }
            return await db.select().from(Client).limit(limit).offset(offset).orderBy(asc(Client.name));
        }
    }
    async generateUuid(): Promise<string> {
        const uuid = uuidv4();
        const exists = await db.select().from(Client).where(eq(Client.id, uuid)).get();
        if (exists) {
            return this.generateUuid();
        }
        return uuid;
    }
    async getCount(terms: string | null) {
        let total: { count: number } | undefined;
        if (terms) {
            total = await db.select({ count: count(Client.id) }).from(Client).where(like(Client.name, `%${terms}%`)).get();
        } else {
            total = await db.select({ count: count(Client.id) }).from(Client).get();
        }
        return total ? total.count : 0;
    }
    async getSelectFill() {
        return await db.select({
            id: Client.id,
            name: Client.name
        }).from(Client).orderBy(desc(Client.name));
    }
    async getContacts(id: string) {
        return await db.select().from(ClientContact).where(eq(ClientContact.clientId, id));
    }
}