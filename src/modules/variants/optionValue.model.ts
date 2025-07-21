import { db } from "@DB/sqlite";
import { VariantOptionValue } from "@DB/sqlite/schema";
import { eq, or, and, like, asc, desc } from "drizzle-orm";

export class OptionValueModel {

    async create(data: {
        name: string;
        optionId: number;
        active: boolean;
        image: string;
        code: string;
        value: string;
        abbreviation: string;
        customized: boolean;
    }) {
        try {
            const result = await db.insert(VariantOptionValue).values(data).returning();
            return result ? result[0] : null;
        } catch (error) {
            console.error("Create Variant Option Error: ", error);
            return null;
        }
    }

    async getAll(terms: string | null, page: number, limit: number, active: boolean, sorting: string) {
        try {
            const offset = page > 1 ? page * limit - 1 : 1;
            if (sorting !== 'asc') {
                if (active) {
                    if (terms) {
                        return await db.select()
                            .from(VariantOptionValue)
                            .where(
                                and(
                                    eq(VariantOptionValue.active, true),
                                    like(VariantOptionValue.name, `%${terms}%`)
                                )
                            )
                            .limit(limit)
                            .offset(offset)
                            .orderBy(desc(VariantOptionValue.name));
                    }
                    return await db.select()
                        .from(VariantOptionValue)
                        .where(
                            and(
                                eq(VariantOptionValue.active, true),
                            )
                        )
                        .limit(limit)
                        .offset(offset)
                        .orderBy(desc(VariantOptionValue.name));
                }
                if (terms) {
                    return await db.select()
                        .from(VariantOptionValue)
                        .where(
                            like(VariantOptionValue.name, `%${terms}%`)
                        )
                        .limit(limit)
                        .offset(offset)
                        .orderBy(desc(VariantOptionValue.name));
                }
                return await db.select()
                    .from(VariantOptionValue)
                    .limit(limit)
                    .offset(offset)
                    .orderBy(desc(VariantOptionValue.name));
            }
            if (active) {
                if (terms) {
                    return await db.select()
                        .from(VariantOptionValue)
                        .where(
                            and(
                                eq(VariantOptionValue.active, true),
                                like(VariantOptionValue.name, `%${terms}%`)
                            )
                        )
                        .limit(limit)
                        .offset(offset)
                        .orderBy(asc(VariantOptionValue.name));
                }
                return await db.select()
                    .from(VariantOptionValue)
                    .where(
                        and(
                            eq(VariantOptionValue.active, true),
                        )
                    )
                    .limit(limit)
                    .offset(offset)
                    .orderBy(asc(VariantOptionValue.name));
            }
            if (terms) {
                return await db.select()
                    .from(VariantOptionValue)
                    .where(
                        like(VariantOptionValue.name, `%${terms}%`)
                    )
                    .limit(limit)
                    .offset(offset)
                    .orderBy(asc(VariantOptionValue.name));
            }
            return await db.select()
                .from(VariantOptionValue)
                .limit(limit)
                .offset(offset)
                .orderBy(asc(VariantOptionValue.name));
        } catch (error) {
            console.error("Get Variant Options Error: ", error);
            return null;
        }
    }

    async getValueByOption(id: number) {
        try {
            const result = await db.select().from(VariantOptionValue).where(eq(VariantOptionValue.optionId, id)).get();
            return result ?? null;
        } catch (error) {
            console.error("Get Variant Option By ID Error: ", error);
            return null;
        }
    }

    async getOptionValueById(id: number) {
        try {
            const result = await db.select().from(VariantOptionValue).where(eq(VariantOptionValue.id, id)).get();
            return result ?? null;
        } catch (error) {
            console.error("Get Variant Option By ID Error: ", error);
            return null;
        }
    }

    async update(id: number, data: {
        name: string;
        optionId: number;
        active: boolean;
        image: string;
        code: string;
        value: string;
        abbreviation: string;
        customized: boolean;
    }) {
        try {
            const result = await db.update(VariantOptionValue)
                .set(data)
                .where(
                    and(
                        eq(VariantOptionValue.id, id)
                    )
                )
                .returning();
            return result ? result[0] : null;
        } catch (error) {
            console.error("Update Variant Option Error: ", error);
            return null;
        }
    }
}