import { db } from "@DB/sqlite";
import { and, asc, count, desc, eq, like } from "drizzle-orm";
import { Category, CategoryCommonName, CategoryStore, CommonName, Product, ProductToCommonName, ProductType, ProductTypeCommonName } from "@DB/sqlite/schema";
import type { StoreCategories } from "@Types/schemas/commonName";
export class CommonNameModel {

    constructor() { }

    async selectCommonNames() {
        const commonNames = await db.select({
            id: CommonName.id,
            name: CommonName.name,
            allow: {
                description: CommonName.descriptionAllowed,
                collection: CommonName.collectionAllowed
            }
        }).from(CommonName).where(eq(CommonName.active, true));
        return commonNames;
    }

    async getAll(terms: string | null, page: number, limit: number, active: boolean, sorting: string) {
        const offset = page > 1 ? (page - 1) * limit : 1;
        if (terms) {
            if (active) {
                if (sorting !== 'asc') {
                    return await db.select()
                        .from(CommonName)
                        .where(and(
                            eq(CommonName.active, true),
                            like(CommonName.name, `%${terms}%`)
                        )).orderBy(desc(CommonName.name))
                        .limit(limit)
                        .offset(offset);
                }
                return await db.select()
                    .from(CommonName)
                    .where(and(
                        eq(CommonName.active, true),
                        like(CommonName.name, `%${terms}%`)
                    ))
                    .orderBy(asc(CommonName.name))
                    .limit(limit)
                    .offset(offset);
            }
            if (sorting !== 'asc') {
                return await db.select()
                    .from(CommonName)
                    .where(and(
                        like(CommonName.name, `%${terms}%`)
                    ))
                    .orderBy(desc(CommonName.name))
                    .limit(limit)
                    .offset(offset);
            }
            return await db.select()
                .from(CommonName)
                .where(and(
                    like(CommonName.name, `%${terms}%`)
                ))
                .orderBy(asc(CommonName.name))
                .limit(limit)
                .offset(offset);
        }
        if (active) {
            if (sorting !== 'asc') {
                return await db.select()
                    .from(CommonName)
                    .where(and(
                        eq(CommonName.active, true)
                    )).orderBy(desc(CommonName.name))
                    .limit(limit)
                    .offset(offset);
            }
            return await db.select()
                .from(CommonName)
                .where(and(
                    eq(CommonName.active, true)
                ))
                .orderBy(asc(CommonName.name))
                .limit(limit)
                .offset(offset);
        }
        if (sorting !== 'asc') {
            return await db.select()
                .from(CommonName)
                .orderBy(desc(CommonName.name))
                .limit(limit)
                .offset(offset);
        }
        return await db.select()
            .from(CommonName)
            .orderBy(asc(CommonName.name))
            .limit(limit)
            .offset(offset);
    }

    async getByName(name: string) {
        const res = await db.select().from(CommonName).where(eq(CommonName.name, name)).get();
        return res ?? null;
    }

    async getCount(terms: string | null, active: boolean) {
        if (terms) {
            if (active) {
                return await db.select({ count: count(CommonName.id) })
                    .from(CommonName)
                    .where(
                        and(
                            eq(CommonName.active, true),
                            like(CommonName.name, `%${terms}%`)
                        )
                    );
            }
            return await db.select({ count: count(CommonName.id) })
                .from(CommonName)
                .where(
                    and(
                        like(CommonName.name, `%${terms}%`)
                    )
                );
        }
        if (active) {
            return await db.select({ count: count(CommonName.id) })
                .from(CommonName)
                .where(
                    and(
                        eq(CommonName.active, true)
                    )
                );
        }
        return await db.select({ count: count(CommonName.id) })
            .from(CommonName);
    }

    async getCommonSiblings(parentId: number) {
        const res = await db.select({
            id: CommonName.id,
            name: CommonName.name
        }).from(CommonName)
            .where(eq(CommonName.parentId, parentId));
        return res ?? null;
    }

    async getCommonChildren(id: number) {
        const res = await db.select({
            id: CommonName.id,
            name: CommonName.name
        }).from(CommonName)
            .where(eq(CommonName.parentId, id));
        return res ?? null;
    }

    async add(commonName: {
        name: string;
        active: boolean;
        position: number;
        descriptionAllowed: boolean;
        parentId: number | null;
        storeId: bigint | null;
        handle: string;
        storeName: string;
        storeCategories: StoreCategories | null;
    }) {
        const exists = await db.select().from(CommonName).where(eq(CommonName.name, commonName.name));
        if (exists.length > 0) return exists[0];
        const storeCategories: number[] = commonName.storeCategories ? commonName.storeCategories.map(category => category.id) : [];
        const result = await db.insert(CommonName).values({
            name: commonName.name,
            position: commonName.position,
            active: commonName.active,
            descriptionAllowed: commonName.descriptionAllowed,
            parentId: commonName.parentId,
            storeId: commonName.storeId,
            storeName: commonName.storeName,
            handle: commonName.handle,
            storeCategories: JSON.stringify(storeCategories)
        }).returning();
        return result.length > 0 ? result[0] : null;
    }

    async addCategory(id: number, category: number) {
        const exists = await db.select()
            .from(CategoryCommonName)
            .where(
                and(
                    eq(CategoryCommonName.commonNameId, id),
                    eq(CategoryCommonName.categoryId, category)));
        if (exists.length > 0) return exists;
        const result = await db.insert(CategoryCommonName).values({ commonNameId: id, categoryId: category }).returning();
        return result.length > 0 ? result[0] : null;
    }

    async addProductType(id: number, productType: number) {
        const exists = await db.select()
            .from(ProductTypeCommonName)
            .where(
                and(
                    eq(ProductTypeCommonName.commonNameId, id),
                    eq(ProductTypeCommonName.productTypeId, productType)));
        if (exists.length > 0) return exists;
        const result = await db.insert(ProductTypeCommonName).values({ commonNameId: id, productTypeId: productType }).returning();
        return result.length > 0 ? result[0] : null;
    }

    async update(id: number, commonName: {
        name: string;
        active: boolean;
    }) {
        return await db.update(CommonName).set({
            name: commonName.name as string,
            active: commonName.active
        }).where(eq(CommonName.id, id)).returning();
    }

    async delete(id: number) {
        return await db.delete(CommonName).where(eq(CommonName.id, id)).returning();
    }

    async getById(id: number) {
        const res = await db.select({
            id: CommonName.id,
            name: CommonName.name,
            allow: {
                description: CommonName.descriptionAllowed,
                collection: CommonName.collectionAllowed
            },
            position: CommonName.position,
            active: CommonName.active,
            parent: CommonName.parentId,
            store: {
                id: CommonName.storeId,
                name: CommonName.storeName,
                handle: CommonName.handle,
                categories: CommonName.storeCategories
            },
            history: {
                created: CommonName.createdAt,
                updated: CommonName.updatedAt,
                deleted: CommonName.deletedAt
            }
        })
            .from(CommonName)
            .where(eq(CommonName.id, id)).get();
        if (res) {
            const storeCats = JSON.parse(res.store.categories as string);
            const categories: StoreCategories[] = await Promise.all(storeCats.map(async (cat:number) => {
                return await db.select()
                    .from(CategoryStore).where(eq(CategoryStore.id, cat)).get();
            }));
            return {
                id: res.id,
                name: res.name,
                allow: res.allow,
                position: res.position,
                active: res.active,
                parent: res.parent,
                store: {
                    id: res.store.id,
                    name: res.store.name,
                    handle: res.store.handle,
                    categories: categories
                },
                history: res.history
            };
        }
        return null;
    }

    async getCategories(id: number) {
        return await db.select({
            id: CategoryCommonName.categoryId,
            name: Category.name
        })
            .from(CategoryCommonName)
            .innerJoin(Category, eq(CategoryCommonName.categoryId, Category.id))
            .where(eq(CategoryCommonName.commonNameId, id));
    }

    async getProductTypes(id: number) {
        return await db.select({
            id: ProductTypeCommonName.productTypeId,
            name: ProductType.name
        })
            .from(ProductTypeCommonName)
            .innerJoin(ProductType, eq(ProductTypeCommonName.productTypeId, ProductType.id))
            .where(eq(ProductTypeCommonName.commonNameId, id));
    }

    async create(data: {
        name: string;
        active: boolean;
        position: number;
        allow: {
            description: boolean;
            collection: boolean;
        };
        parent: number | null;
        handle: string;
    }) {
        const res = await db.insert(CommonName).values({
            name: data.name,
            position: data.position,
            active: data.active,
            parentId: data.parent,
            handle: data.handle,
            descriptionAllowed: data.allow.description,
            collectionAllowed: data.allow.collection
        }).returning();
        return res.length > 0 ? res[0] : null;
    }

    async countProductsByCommonName(id: number) {
        const res = await db.select({ count: count(Product.id) })
            .from(Product)
            .leftJoin(ProductToCommonName, eq(ProductToCommonName.productId, Product.id))
            .where(eq(ProductToCommonName.commonNameId, id));
        return res[0].count;
    }
}
