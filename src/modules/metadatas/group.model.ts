import { db } from "@DB/sqlite";
import { Group } from "@DB/sqlite/schema";
import { and, asc, desc, eq, like, count } from "drizzle-orm";

export class MetadataGroupModel {
    async create(data: {
        name: string;
        active: boolean;
        position: number;
        descriptionAllowed: boolean;
    }) {
        //  If item exist send error message
        const exist = await db.select().from(Group).where(eq(Group.name, data.name)).get();
        if (exist) {
            return { status: 'fail', data: null, message: 'Metadata Group already exist' };
        }
        const result = await db.insert(Group).values(data);
        if (result) {
            return { status: 'ok', data: result, message: null };
        }
        return { status: 'fail', data: null, message: 'Metadata not created' };
    }

    async getAll(terms: string | null, page: number, limit: number, active: boolean, sorting: string) {
        const offset = page > 1 ? (page - 1) * limit : 0;
        if (terms) {
            if (active) {
                if (sorting === 'asc') {
                    return await db.select().from(Group).where(
                        and(
                            eq(Group.active, true),
                            like(Group.name, `%${terms}%`)
                        )
                    ).limit(limit).offset(offset).orderBy(asc(Group.name));
                }
                return await db.select().from(Group).where(
                    and(
                        eq(Group.active, true),
                        like(Group.name, `%${terms}%`)
                    )
                ).limit(limit).offset(offset).orderBy(desc(Group.name));
            }
            if (sorting === 'asc') {
                return await db.select().from(Group).where(
                    like(Group.name, `%${terms}%`)
                ).limit(limit).offset(offset).orderBy(asc(Group.name));
            }
            return await db.select().from(Group).where(
                like(Group.name, `%${terms}%`)
            ).limit(limit).offset(offset).orderBy(desc(Group.name));
        }
        if (active) {
            if (sorting === 'asc') {
                return await db.select().from(Group).where(
                    eq(Group.active, true)
                ).limit(limit).offset(offset).orderBy(asc(Group.name));
            }
            return await db.select().from(Group).where(
                eq(Group.active, true)
            ).limit(limit).offset(offset).orderBy(desc(Group.name));
        }
        if (sorting === 'asc') {
            return await db.select().from(Group).limit(limit).offset(offset).orderBy(asc(Group.name));
        }
        return await db.select().from(Group).limit(limit).offset(offset).orderBy(desc(Group.name));
    }

    async update(id: number, data: {
        name: string;
        active: boolean;
        position: number;
        descriptionAllowed: boolean;
    }) {
        const result = await db.update(Group).set(data).where(eq(Group.id, id));
        if (result) {
            return { status: 'ok', data: result, message: null };
        }
        return { status: 'fail', data: null, message: 'Metadata not updated' };
    }

    async delete(id: number) {
        const result = await db.delete(Group).where(eq(Group.id, id));
        if (result) {
            return { status: 'fail', data: null, message: 'Metadata not deleted' };
        }
        return { status: 'ok', data: result, message: 'Metadata deleted' };
    }

    async selectFill() {
        const result = await db.select({
            id: Group.id,
            name: Group.name,
            
        }).from(Group).where(eq(Group.active, true));
        return { status: 'ok', data: result, message: null };
    }

    async getById(id: number) {
        const result = await db.select().from(Group).where(eq(Group.id, id)).get();
        if (result) {
            return result;
        }
        return null;
    }

    async getCount(terms: string | null, active: boolean) {
        if (terms) {
            if (active) {
                const result = await db.select({ count: count(Group.id) }).from(Group).where(
                    and(
                        eq(Group.active, active),
                        like(Group.name, `%${terms}%`)
                    )
                );
                return result ? result[0].count : 0;
            }
            const result = await db.select({ count: count(Group.id) }).from(Group).where(
                and(
                    eq(Group.active, active),
                    like(Group.name, `%${terms}%`)
                )
            );
            return result ? result[0].count : 0;
        }
        if (active) {
            const result = await db.select({ count: count(Group.id) }).from(Group).where(
                eq(Group.active, active)
            );
            return result ? result[0].count : 0;
        }
        const result = await db.select({ count: count(Group.id) }).from(Group);
        return result ? result[0].count : 0;
    }

}
