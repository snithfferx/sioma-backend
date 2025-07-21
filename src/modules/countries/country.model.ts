import { Country } from "@DB/sqlite/schema";
import { db } from "@DB/sqlite";
import { eq, count, like, asc, desc, and } from "drizzle-orm";

export class CountryModel {
    async selectCountries() {
        const countries = await db.select().from(Country).where(eq(Country.active, true));
        return countries;
    }

    async getAll(terms:string | null, page: number, limit: number, active: boolean, sorting: string) {
        const offset = page > 1 ? page * limit - 1 : 1;
        if (terms) {
            if (active) {
                if (sorting !== 'asc') {
                    return await db.select()
                        .from(Country)
                        .where(
                            like(Country.name, `%${terms}%`)
                        )
                        .limit(limit)
                        .offset(offset)
                        .orderBy(desc(Country.name));
                }
                return await db.select()
                    .from(Country)
                    .where(
                        like(Country.name, `%${terms}%`)
                    )
                    .limit(limit)
                    .offset(offset)
                    .orderBy(asc(Country.name));
            }
            if (sorting !== 'asc') {
                return await db.select()
                    .from(Country)
                    .where(
                        like(Country.name, `%${terms}%`)
                    )
                    .limit(limit)
                    .offset(offset)
                    .orderBy(desc(Country.name));
            }
            return await db.select()
                .from(Country)
                .where(
                    like(Country.name, `%${terms}%`)
                )
                .limit(limit)
                .offset(offset)
                .orderBy(asc(Country.name));
        }
        if (active) {
            if (sorting !== 'asc') {
                return await db.select()
                    .from(Country)
                    .limit(limit)
                    .offset(offset)
                    .orderBy(desc(Country.name));
            }
            return await db.select()
                .from(Country)
                .limit(limit)
                .offset(offset)
                .orderBy(asc(Country.name));
        }
        if (sorting !== 'asc') {
            return await db.select()
                .from(Country)
                .limit(limit)
                .offset(offset)
                .orderBy(desc(Country.name));
        }
        return await db.select()
            .from(Country)
            .limit(limit)
            .offset(offset)
            .orderBy(asc(Country.name));
    }

    async getCount(terms: string | null, active: boolean) {
        if (terms) {
            if (active) {
                const res = await db.select({ count: count(Country.id) })
                    .from(Country)
                    .where(
                        and(
                            eq(Country.active, true),
                            like(Country.name, `%${terms}%`)
                        )
                );
                return res[0].count;
            }
            const res = await db.select({ count: count(Country.id) })
                .from(Country)
                .where(
                    and(
                        like(Country.name, `%${terms}%`)
                    )
            );
            return res[0].count;
        }
        if (active) {
            const res =  await db.select({ count: count(Country.id) })
                .from(Country)
                .where(
                    and(
                        eq(Country.active, true)
                    )
            );
            return res[0].count;
        }
        const res =  await db.select({ count: count(Country.id) }).from(Country);
        return res[0].count;
    }

    async add(data: {
        name: string;
        active: boolean | null;
    }) {
        const exists = await db.select().from(Country).where(eq(Country.name, data.name)).get();
        if (exists) return exists;
        const newCountry = await db.insert(Country).values({
            name: data.name,
            active: data.active ?? false
        }).returning();
        return newCountry.length > 0 ? newCountry[0] : null;
    }

    async create(data: {
        name: string;
        code: string | null;
        zip: string | null;
        area: string | null;
        flag: string | null;
        active: boolean | null;
    }) {
        const exists = await db.select().from(Country).where(eq(Country.name, data.name)).get();
        if (exists) return exists;
        const newCountry = await db.insert(Country).values({
            name: data.name,
            active: data.active ?? false,
            code: data.code ?? '',
            zip: data.zip ?? '',
            area: data.area ?? '',
            flag: data.flag ?? '',
        }).returning();
        return newCountry.length > 0 ? newCountry[0] : null;
    }

    async getById(id: number) {
        const res = await db.select({
            id: Country.id,
            name: Country.name,
            code: Country.code,
            zip: Country.zip,
            area: Country.area,
            flag: Country.flag,
            active: Country.active
        }).from(Country).where(eq(Country.id, id)).get();
        return res;
    }

    async update(id: number, data: {
        name: string;
        code: string | null;
        zip: string | null;
        area: string | null;
        flag: string | null;
        active: boolean | null;
    }) {
        const exists = await db.select().from(Country).where(eq(Country.id, id)).get();
        if (!exists) return null;
        const newCountry = await db.insert(Country).values(data).returning();
        return newCountry.length > 0 ? newCountry[0] : null;
    }

    async delete(id: number) {
        return await db.delete(Country).where(eq(Country.id, id)).returning();
    }

    async search(terms: string | null) {
        if (terms) {
            return await db.select({
                id: Country.id,
                name: Country.name,
                code: Country.code,
                zip: Country.zip,
                area: Country.area,
                flag: Country.flag,
                active: Country.active
            })
                .from(Country)
                .where(
                    and(
                        like(Country.name, `%${terms}%`)
                    )
                )
                .limit(10)
                .offset(0);
        }
        return null;
    }
}