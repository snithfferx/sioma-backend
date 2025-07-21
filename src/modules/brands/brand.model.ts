import { Brand, Product, Status } from "@DB/sqlite/schema";
import { db } from "@DB/sqlite";
import { and, asc, count, desc, eq, like } from "drizzle-orm";
import type { Brand as BrandSchema } from "@Types/schemas/brand";

export class BrandModel {
    async selectBrands() {
        const brands = await db.select().from(Brand).where(eq(Brand.active, true));
        return brands;
    }

    async getById(id: number) {
        const brand = await db.select().from(Brand).where(eq(Brand.id, id)).get();
        // get count of Products by brand id group by statusId
        const products = await db.select({
            status: Status.name,
            count: count(Product.id)
        })
            .from(Product)
            .leftJoin(Status, eq(Product.statusId, Status.id))
            .where(eq(Product.brandId, id))
            .groupBy(Status.name);
        if (brand) {
            return {
                ...brand,
                products: products
            };
        }
        return null;
    }

    async getByName(name: string) {
        const brand = await db.select().from(Brand).where(eq(Brand.name, name)).get();
        return brand ?? null;
    }

    async getAll(page: number, limit: number, active: boolean, sorting: string) {
        const offset = page > 1 ? (page - 1) * limit : 0;
        if (active) {
            if (sorting !== 'asc') {
                return await db.select().from(Brand).where(eq(Brand.active, true)).limit(limit).offset(offset).orderBy(desc(Brand.name));
            }
            return await db.select().from(Brand).where(eq(Brand.active, true)).limit(limit).offset(offset).orderBy(asc(Brand.name));
        }
        if (sorting !== 'asc') {
            return await db.select().from(Brand).limit(limit).offset(offset).orderBy(desc(Brand.name));
        }
        return await db.select().from(Brand).limit(limit).offset(offset).orderBy(asc(Brand.name));
    }

    async getAllByTerms(terms: string|null, page: number, limit: number, active: boolean, sorting: string) {
        const offset = page > 1 ? (page - 1) * limit : 0;
        if (terms) {
            if (active) {
                if (sorting !== 'asc') {
                    return await db.select()
                        .from(Brand)
                        .where(
                            and(
                                eq(Brand.active, true),
                                like(Brand.name, `%${terms}%`)
                            ))
                        .limit(limit)
                        .offset(offset)
                        .orderBy(desc(Brand.name));
                }
                return await db.select()
                    .from(Brand)
                    .where(
                        and(
                            eq(Brand.active, true),
                            like(Brand.name, `%${terms}%`)
                        ))
                    .limit(limit)
                    .offset(offset)
                    .orderBy(asc(Brand.name));
            }
            if (sorting !== 'asc') {
                return await db.select()
                    .from(Brand)
                    .where(
                        like(Brand.name, `%${terms}%`)
                    )
                    .limit(limit)
                    .offset(offset)
                    .orderBy(desc(Brand.name));
            }
            return await db.select()
                .from(Brand)
                .where(
                    like(Brand.name, `%${terms}%`)
                )
                .orderBy(asc(Brand.name))
                .limit(limit)
                .offset(offset);
        }
        if (active) {
            if (sorting !== 'asc') {
                return await db.select()
                    .from(Brand)
                    .where(
                        and(
                            eq(Brand.active, true)
                        ))
                    .limit(limit)
                    .offset(offset)
                    .orderBy(desc(Brand.name));
            }
            return await db.select()
                .from(Brand)
                .where(
                    and(
                        eq(Brand.active, true)
                    ))
                .limit(limit)
                .offset(offset)
                .orderBy(asc(Brand.name));
        }
        if (sorting !== 'asc') {
            return await db.select()
                .from(Brand)
                .limit(limit)
                .offset(offset)
                .orderBy(desc(Brand.name));
        }
        return await db.select()
                .from(Brand)
                .limit(limit)
                .offset(offset)
                .orderBy(asc(Brand.name));
    }

    async create(data: Partial<BrandSchema>) {
        if (!data.name) {
            throw new Error("Name is required.");
        }
        const exists = await this.getByName(data.name);
        if (exists) return null; // Brand already exists

        const result = await db.insert(Brand).values({
            id: data.id ?? undefined,
            name: data.name,
            description: data.description ?? null,
            logo: data.logo ?? null,
            active: true
        }).returning();

        return result ? result[0] : null;
    }

    async update(id: number, data: Partial<BrandSchema>) {
        const brand = await this.getById(id);
        if (!brand) return null; // Brand not found

        const updatedBrand = await db.update(Brand)
            .set({
                name: data.name ?? brand.name,
                description: data.description ?? brand.description,
                logo: data.logo ?? brand.logo,
                active: data.active ?? brand.active
            })
            .where(eq(Brand.id, id))
            .returning();

        return updatedBrand ? updatedBrand[0] : null;
    }

    async getCount(terms: string | null, active: boolean) {
        if (terms) {
            if (active) {
                return await db.select({ count: count(Brand.id) })
                .from(Brand)
                .where(
                    and(
                        eq(Brand.active, true), 
                        like(Brand.name, `%${terms}%`)
                    )
                );
            }
            return await db.select({ count: count(Brand.id) })
            .from(Brand)
            .where(
                and(
                    like(Brand.name, `%${terms}%`)
                )
            );
        }
        if (active) {
            return await db.select({ count: count(Brand.id) })
            .from(Brand)
            .where(
                and(
                    eq(Brand.active, true)
                )
            );
        }
        return await db.select({ count: count(Brand.id) })
        .from(Brand);
    }

    async delete(id: number) {
        const brand = await this.getById(id);
        if (!brand) return null; // Brand not found

        const deletedBrand = await db.delete(Brand)
            .where(eq(Brand.id, id))
            .returning();

        return deletedBrand ? deletedBrand[0] : null;
    }
}