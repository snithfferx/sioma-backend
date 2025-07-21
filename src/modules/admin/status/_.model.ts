import { db } from "@DB/sqlite";
import { Status } from "@DB/sqlite/schema";
import { and, asc, desc, eq, like, count } from "drizzle-orm";

export class StatusModel {
    async create(data:{
        name:string;
        description:string;
        active:boolean;
    }) {
        const res = await db.insert(Status).values({
            name: data.name,
            description: data.description,
            active: data.active
        }).returning();
        return res.length > 0 ? res[0] : null;
    }

    async update(id:number,data:{
        name:string;
        description:string;
        active:boolean;
    }) {
        const res = await db.update(Status).set({
            name: data.name,
            description: data.description,
            active: data.active
        }).where(eq(Status.id, id)).returning();
        return res.length > 0 ? res[0] : null;
    }

    async delete(id:number) {
        const res = await db.delete(Status).where(eq(Status.id, id)).returning();
        return res.length > 0 ? res[0] : null;
    }

    async getAll(terms:string|null,page:number,limit:number,sort:string,active:boolean) {
        const offset = page * limit - 1;
        if (sort === 'asc') {
            if (active) {
                if (terms) {
                    return await db.select().from(Status).where(and(eq(Status.active, true),like(Status.name, `%${terms}%`))).limit(limit).offset(offset).orderBy(asc(Status.name));
                } else {
                    return await db.select().from(Status).where(eq(Status.active, true)).limit(limit).offset(offset).orderBy(asc(Status.name));
                }
            } else {
                if (terms) {
                    return await db.select().from(Status).where(and(eq(Status.active, false),like(Status.name, `%${terms}%`))).limit(limit).offset(offset).orderBy(asc(Status.name));
                } else {
                    return await db.select().from(Status).where(eq(Status.active, false)).limit(limit).offset(offset).orderBy(asc(Status.name));
                }
            }
        } else {
            if (active) {
                if (terms) {
                    return await db.select().from(Status).where(and(eq(Status.active, true),like(Status.name, `%${terms}%`))).limit(limit).offset(offset).orderBy(desc(Status.name));
                } else {
                    return await db.select().from(Status).where(eq(Status.active, true)).limit(limit).offset(offset).orderBy(desc(Status.name));
                }
            } else {
                if (terms) {
                    return await db.select().from(Status).where(and(eq(Status.active, false),like(Status.name, `%${terms}%`))).limit(limit).offset(offset).orderBy(desc(Status.name));
                } else {
                    return await db.select().from(Status).where(eq(Status.active, false)).limit(limit).offset(offset).orderBy(desc(Status.name));
                }
            }
        }
    }

    async getCount(terms:string|null,active:boolean) {
        if (active) {
            if (terms) {
                const res = await db.select({count: count(Status.id)}).from(Status).where(and(eq(Status.active, true),like(Status.name, `%${terms}%`))).get();
                return res ? res.count : 0;
            } else {
                const res = await db.select({count: count(Status.id)}).from(Status).where(eq(Status.active, true)).get();
                return res ? res.count : 0;
            }
        } else {
            if (terms) {
                const res = await db.select({count: count(Status.id)}).from(Status).where(and(eq(Status.active, false),like(Status.name, `%${terms}%`))).get();
                return res ? res.count : 0;
            } else {
                const res = await db.select({count: count(Status.id)}).from(Status).where(eq(Status.active, false)).get();
                return res ? res.count : 0;
            }
        }
    }

    async getAllActive() {
        return await db.select({id: Status.id,name: Status.name}).from(Status).where(eq(Status.active, true));
    }

    async getAllInactive() {
        return await db.select({id: Status.id,name: Status.name}).from(Status).where(eq(Status.active, false));
    }

    async getById(id:number) {
        return await db.select().from(Status).where(eq(Status.id, id)).get();
    }
}
