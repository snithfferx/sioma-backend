import { db } from "@DB/sqlite";
import { VariantOption } from "@DB/sqlite/schema";
import { eq, or, and, like, asc, desc } from "drizzle-orm";

export class OptionModel {

    async create(data: {
        name: string;
        values: string;
    }) {
        try {
            const result = await db.insert(VariantOption).values(data).returning();
            return result ? result[0] : null;
        } catch (error) {
            console.error("Create Variant Option Error: ", error);
            return null;
        }
    }

    async getAll(terms: string | null, page: number, limit: number, sorting: string) {
        try {
            const offset = page > 1 ? page * limit - 1 : 1;
            if (terms) {
                if (sorting !== 'asc') {
                    return await db.select()
                        .from(VariantOption)
                        .where(
                            like(VariantOption.name, `%${terms}%`)
                        )
                        .limit(limit)
                        .offset(offset)
                        .orderBy(desc(VariantOption.name));
                }
                return await db.select()
                    .from(VariantOption)
                    .where(
                        like(VariantOption.name, `%${terms}%`)
                    )
                    .limit(limit)
                    .offset(offset)
                    .orderBy(asc(VariantOption.name));
            }
            if (sorting !== 'asc') {
                return await db.select()
                    .from(VariantOption)
                    .limit(limit)
                    .offset(offset)
                    .orderBy(desc(VariantOption.name));
            }
            return await db.select()
                .from(VariantOption)
                .limit(limit)
                .offset(offset)
                .orderBy(asc(VariantOption.name));
        } catch (error) {
            console.error("Get Variant Options Error: ", error);
            return null;
        }
    }

    async getOptionById(id: number) {
        try {
            const result = await db.select().from(VariantOption).where(eq(VariantOption.id, id)).get();
            return result ?? null;
        } catch (error) {
            console.error("Get Variant Option By ID Error: ", error);
            return null;
        }
    }
    async getSelectFill() {
        try {
            const result = await db.select({
                id: VariantOption.id,
                name: VariantOption.name
            }).from(VariantOption);
            return result ?? null;
        } catch (error) {
            console.error("Get Variant Options Error: ", error);
            return null;
        }
    }

    async update(id: number, data: {
        name: string;
        values: string;
    }) {
        try {
            const result = await db.update(VariantOption)
                .set(data)
                .where(
                    and(
                        eq(VariantOption.id, id)
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