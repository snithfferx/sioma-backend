import { db } from '@DB/sqlite';
import { Brand, CategoryPrice, Price, Product, Status, Stock, Sucursal, User, Variant, Warehouse } from '@DB/sqlite/schema';
import { and, asc, count, desc, eq, like, ne } from 'drizzle-orm';
import type { Product as ProductSchema } from '@Types/schemas/product';

export class ProductModel {
    constructor() { }

    async getProductById(id: number) {
        const product = await db.select().from(Product).where(eq(Product.id, id)).get();
        return product ?? null;
    }

    async createProduct(product: ProductSchema) {
        const result = await db.insert(Product).values({
            name: product.name,
            longDescription: product.longDescription,
            shortDescription: product.shortDescription,
            seoDescription: product.seoDescription,
            seoKeywords: product.seoKeywords,
            seoTitle: product.seoTitle,
            warranty: product.warranty,
            brandId: product.brandId,
            statusId: product.statusId,
            originId: product.originId
        }).returning();
        return result ? result[0] : null;
    }

    async updateProduct(id: number, product: ProductSchema) {
        const result = await db.update(Product).set({
            name: product.name,
            longDescription: product.longDescription,
            shortDescription: product.shortDescription,
            seoDescription: product.seoDescription,
            seoKeywords: product.seoKeywords,
            seoTitle: product.seoTitle,
            warranty: product.warranty,
            brandId: product.brandId,
            statusId: product.statusId,
            originId: product.originId
        }).where(eq(Product.id, id)).returning();
        return result ? result[0] : null;
    }

    async getProductByUPC(upc: string) {
        const product = await db.select()
            .from(Product)
            .leftJoin(Variant, eq(Variant.upc, upc))
            .where(eq(Product.id, Variant.productId)).get();
        return product;
    }

    async getProductByMPN(mpn: string) {
        const product = await db.select()
            .from(Product)
            .leftJoin(Variant, eq(Variant.mpn, mpn))
            .where(eq(Product.id, Variant.productId)).get();
        return product;
    }

    async getProductBySKU(sku: string) {
        const product = await db.select()
            .from(Product)
            .leftJoin(Variant, eq(Variant.sku, sku))
            .where(eq(Product.id, Variant.productId)).get();
        return product;
    }

    async productExists(param: { upc?: string, mpn?: string, sku?: string }) {
        const { upc, mpn, sku } = param;
        if (upc) {
            const product = await this.getProductByUPC(upc);
            return !!product;
        }
        if (mpn) {
            const product = await this.getProductByMPN(mpn);
            return !!product;
        }
        if (sku) {
            const product = await this.getProductBySKU(sku);
            return !!product;
        }
        return false;
    }

    async getAll(page: number, limit: number, terms: string | null, sort: string, outOfStock: boolean) {
        const offset = (page - 1) * limit;
        // filter deleted
        if (terms) {
            if (outOfStock) {
                if (sort !== 'asc') {
                    return await db.select()
                        .from(Product)
                        .leftJoin(Variant, eq(Variant.productId, Product.id))
                        .where(
                            like(Product.name, `%${terms}%`),
                        )
                        .limit(limit)
                        .offset(offset)
                        .orderBy(desc(Product.name));
                }
                return await db.select()
                    .from(Product)
                    .leftJoin(Variant, eq(Variant.productId, Product.id))
                    .where(
                        like(Product.name, `%${terms}%`)
                    )
                    .limit(limit)
                    .offset(offset)
                    .orderBy(asc(Product.name));
            }
            if (sort !== 'asc') {
                return await db.select()
                    .from(Product)
                    .leftJoin(Variant, eq(Variant.productId, Product.id))
                    .where(
                        and(
                            ne(Product.statusId, 6),
                            like(Product.name, `%${terms}%`)
                        )
                    )
                    .limit(limit)
                    .offset(offset)
                    .orderBy(desc(Product.name));
            }
            return await db.select()
                .from(Product)
                .leftJoin(Variant, eq(Variant.productId, Product.id))
                .where(
                    and(
                        ne(Product.statusId, 6),
                        like(Product.name, `%${terms}%`)
                    )
                )
                .limit(limit)
                .offset(offset)
                .orderBy(asc(Product.name));
        }
        if (outOfStock) {
            if (sort !== 'asc') {
                return await db.select()
                    .from(Product)
                    .leftJoin(Variant, eq(Variant.productId, Product.id))
                    .where(
                        ne(Product.statusId, 6),
                    )
                    .limit(limit)
                    .offset(offset)
                    .orderBy(desc(Product.name));
            }
            return await db.select()
                .from(Product)
                .leftJoin(Variant, eq(Variant.productId, Product.id))
                .where(
                    ne(Product.statusId, 6),
                )
                .limit(limit)
                .offset(offset)
                .orderBy(asc(Product.name));
        }
        if (sort !== 'asc') {
            return await db.select()
                .from(Product)
                .leftJoin(Variant, eq(Variant.productId, Product.id))
                .limit(limit)
                .offset(offset)
                .orderBy(desc(Product.name));
        }
        return await db.select()
            .from(Product)
            .leftJoin(Variant, eq(Variant.productId, Product.id))
            .limit(limit)
            .offset(offset)
            .orderBy(asc(Product.name));
    }

    async getCount(terms: string | null, outOfStock: boolean) {
        let total;
        if (terms) {
            if (outOfStock) {
                total = await db.select({ count: count(Product.id) })
                    .from(Product)
                    .leftJoin(Variant, eq(Variant.productId, Product.id))
                    .where(
                        like(Product.name, `%${terms}%`)
                    ).get();
            }
            total = await db.select({ count: count(Product.id) })
                .from(Product)
                .leftJoin(Variant, eq(Variant.productId, Product.id))
                .where(
                    like(Product.name, `%${terms}%`)
                ).get();
        }
        if (outOfStock) {
            total = await db.select({ count: count(Product.id) })
                .from(Product)
                .leftJoin(Variant, eq(Variant.productId, Product.id))
                .where(
                    ne(Product.statusId, 6),
                ).get();
        }
        total = await db.select({ count: count(Product.id) })
            .from(Product)
            .leftJoin(Variant, eq(Variant.productId, Product.id))
            .get();
        return total?.count??0;
    }

    async getAdminList(terms:string|null,page:number,limit:number,sorting:string,active:boolean,status:number|null) {
        const offset = (page - 1) * limit;
        const list = [];
        if (terms) {
            if (status !== null) {
                if (active) {
                    if (sorting !== 'asc') {
                        const res = await db.select({
                            id: Variant.id,
                            name: Product.name,
                            sku: Variant.sku,
                            mpn: Variant.mpn,
                            upc: Variant.upc,
                            store: {
                                id: Variant.storeId,
                                name: Variant.storeName,
                                handle: Variant.handle,
                                active: Variant.active,
                            },
                            brand: {
                                id: Product.brandId,
                                name: Brand.name
                            },
                            status: {
                                id: Variant.status,
                                name: Status.name
                            },
                            variant: {
                                isMain: Variant.main,
                                mainId: Variant.mainId,
                                position: Variant.position
                            },
                            customizable: Variant.customizable,
                            downloadable: Variant.downloadable,
                            syncronized: Variant.syncronized,
                            history: {
                                createdAt: Variant.createdAt,
                                updatedAt: Variant.updatedAt,
                                deletedAt: Variant.deletedAt
                            }
                        })
                        .from(Variant)
                        .leftJoin(Product, eq(Product.id, Variant.productId))
                        .leftJoin(Brand, eq(Brand.id, Product.brandId))
                        .leftJoin(Status, eq(Status.id, Variant.status))
                        .where(
                            and(
                                like(Product.name, `%${terms}%`),
                                eq(Variant.active, true),
                                eq(Variant.status, status)
                            )
                        )
                        .limit(limit)
                        .offset(offset)
                        .orderBy(desc(Variant.title));
                        list.push(...res);
                    }
                    const res = await db.select({
                        id: Variant.id,
                        name: Product.name,
                        sku: Variant.sku,
                        mpn: Variant.mpn,
                        upc: Variant.upc,
                        store: {
                            id: Variant.storeId,
                            name: Variant.storeName,
                            handle: Variant.handle,
                            active: Variant.active,
                        },
                        brand: {
                            id: Product.brandId,
                            name: Brand.name
                        },
                        status: {
                            id: Variant.status,
                            name: Status.name
                        },
                        variant: {
                            isMain: Variant.main,
                            mainId: Variant.mainId,
                            position: Variant.position
                        },
                        customizable: Variant.customizable,
                        downloadable: Variant.downloadable,
                        syncronized: Variant.syncronized,
                        history: {
                            createdAt: Variant.createdAt,
                            updatedAt: Variant.updatedAt,
                            deletedAt: Variant.deletedAt
                        }
                    })
                        .from(Variant)
                        .leftJoin(Product, eq(Product.id, Variant.productId))
                        .leftJoin(Brand, eq(Brand.id, Product.brandId))
                        .leftJoin(Status, eq(Status.id, Variant.status))
                        .where(
                            and(
                                like(Product.name, `%${terms}%`),
                                eq(Variant.active, true),
                                eq(Variant.status, status)
                            )
                        )
                        .limit(limit)
                        .offset(offset)
                        .orderBy(asc(Variant.title));
                    list.push(...res);
                }
                if (sorting !== 'asc') {
                    const res = await db.select({
                        id: Variant.id,
                        name: Product.name,
                        sku: Variant.sku,
                        mpn: Variant.mpn,
                        upc: Variant.upc,
                        store: {
                            id: Variant.storeId,
                            name: Variant.storeName,
                            handle: Variant.handle,
                            active: Variant.active,
                        },
                        brand: {
                            id: Product.brandId,
                            name: Brand.name
                        },
                        status: {
                            id: Variant.status,
                            name: Status.name
                        },
                        variant: {
                            isMain: Variant.main,
                            mainId: Variant.mainId,
                            position: Variant.position
                        },
                        customizable: Variant.customizable,
                        downloadable: Variant.downloadable,
                        syncronized: Variant.syncronized,
                        history: {
                            createdAt: Variant.createdAt,
                            updatedAt: Variant.updatedAt,
                            deletedAt: Variant.deletedAt
                        }
                    })
                        .from(Variant)
                        .leftJoin(Product, eq(Product.id, Variant.productId))
                        .leftJoin(Brand, eq(Brand.id, Product.brandId))
                        .leftJoin(Status, eq(Status.id, Variant.status))
                        .where(
                            and(
                                like(Product.name, `%${terms}%`),
                                eq(Variant.status, status)
                            )
                        )
                        .limit(limit)
                        .offset(offset)
                        .orderBy(desc(Variant.title));
                    list.push(...res);
                }
                const res = await db.select({
                    id: Variant.id,
                    name: Product.name,
                    sku: Variant.sku,
                    mpn: Variant.mpn,
                    upc: Variant.upc,
                    store: {
                        id: Variant.storeId,
                        name: Variant.storeName,
                        handle: Variant.handle,
                        active: Variant.active,
                    },
                    brand: {
                        id: Product.brandId,
                        name: Brand.name
                    },
                    status: {
                        id: Variant.status,
                        name: Status.name
                    },
                    variant: {
                        isMain: Variant.main,
                        mainId: Variant.mainId,
                        position: Variant.position
                    },
                    customizable: Variant.customizable,
                    downloadable: Variant.downloadable,
                    syncronized: Variant.syncronized,
                    history: {
                        createdAt: Variant.createdAt,
                        updatedAt: Variant.updatedAt,
                        deletedAt: Variant.deletedAt
                    }
                })
                    .from(Variant)
                    .leftJoin(Product, eq(Product.id, Variant.productId))
                    .leftJoin(Brand, eq(Brand.id, Product.brandId))
                    .leftJoin(Status, eq(Status.id, Variant.status))
                    .where(
                        and(
                            like(Product.name, `%${terms}%`),
                            eq(Variant.status, status)
                        )
                    )
                    .limit(limit)
                    .offset(offset)
                    .orderBy(asc(Variant.title));
                list.push(...res);
            }
            if (active) {
                if (sorting !== 'asc') {
                    const res = await db.select({
                        id: Variant.id,
                        name: Product.name,
                        sku: Variant.sku,
                        mpn: Variant.mpn,
                        upc: Variant.upc,
                        store: {
                            id: Variant.storeId,
                            name: Variant.storeName,
                            handle: Variant.handle,
                            active: Variant.active,
                        },
                        brand: {
                            id: Product.brandId,
                            name: Brand.name
                        },
                        status: {
                            id: Variant.status,
                            name: Status.name
                        },
                        variant: {
                            isMain: Variant.main,
                            mainId: Variant.mainId,
                            position: Variant.position
                        },
                        customizable: Variant.customizable,
                        downloadable: Variant.downloadable,
                        syncronized: Variant.syncronized,
                        history: {
                            createdAt: Variant.createdAt,
                            updatedAt: Variant.updatedAt,
                            deletedAt: Variant.deletedAt
                        }
                    })
                        .from(Variant)
                        .leftJoin(Product, eq(Product.id, Variant.productId))
                        .leftJoin(Brand, eq(Brand.id, Product.brandId))
                        .leftJoin(Status, eq(Status.id, Variant.status))
                        .where(
                            and(
                                like(Product.name, `%${terms}%`),
                                eq(Variant.active, true)
                            )
                        )
                        .limit(limit)
                        .offset(offset)
                        .orderBy(desc(Variant.title));
                    list.push(...res);
                }
                const res = await db.select({
                    id: Variant.id,
                    name: Product.name,
                    sku: Variant.sku,
                    mpn: Variant.mpn,
                    upc: Variant.upc,
                    store: {
                        id: Variant.storeId,
                        name: Variant.storeName,
                        handle: Variant.handle,
                        active: Variant.active,
                    },
                    brand: {
                        id: Product.brandId,
                        name: Brand.name
                    },
                    status: {
                        id: Variant.status,
                        name: Status.name
                    },
                    variant: {
                        isMain: Variant.main,
                        mainId: Variant.mainId,
                        position: Variant.position
                    },
                    customizable: Variant.customizable,
                    downloadable: Variant.downloadable,
                    syncronized: Variant.syncronized,
                    history: {
                        createdAt: Variant.createdAt,
                        updatedAt: Variant.updatedAt,
                        deletedAt: Variant.deletedAt
                    }
                })
                    .from(Variant)
                    .leftJoin(Product, eq(Product.id, Variant.productId))
                    .leftJoin(Brand, eq(Brand.id, Product.brandId))
                    .leftJoin(Status, eq(Status.id, Variant.status))
                    .where(
                        and(
                            like(Product.name, `%${terms}%`),
                            eq(Variant.active, true)
                        )
                    )
                    .limit(limit)
                    .offset(offset)
                    .orderBy(asc(Variant.title));
                list.push(...res);
            }
            if (sorting !== 'asc') {
                const res = await db.select({
                    id: Variant.id,
                    name: Product.name,
                    sku: Variant.sku,
                    mpn: Variant.mpn,
                    upc: Variant.upc,
                    store: {
                        id: Variant.storeId,
                        name: Variant.storeName,
                        handle: Variant.handle,
                        active: Variant.active,
                    },
                    brand: {
                        id: Product.brandId,
                        name: Brand.name
                    },
                    status: {
                        id: Variant.status,
                        name: Status.name
                    },
                    variant: {
                        isMain: Variant.main,
                        mainId: Variant.mainId,
                        position: Variant.position
                    },
                    customizable: Variant.customizable,
                    downloadable: Variant.downloadable,
                    syncronized: Variant.syncronized,
                    history: {
                        createdAt: Variant.createdAt,
                        updatedAt: Variant.updatedAt,
                        deletedAt: Variant.deletedAt
                    }
                })
                    .from(Variant)
                    .leftJoin(Product, eq(Product.id, Variant.productId))
                    .leftJoin(Brand, eq(Brand.id, Product.brandId))
                    .leftJoin(Status, eq(Status.id, Variant.status))
                    .where(
                        and(
                            like(Product.name, `%${terms}%`)
                        )
                    )
                    .limit(limit)
                    .offset(offset)
                    .orderBy(desc(Variant.title));
                list.push(...res);
            }
            const res = await db.select({
                id: Variant.id,
                name: Product.name,
                sku: Variant.sku,
                mpn: Variant.mpn,
                upc: Variant.upc,
                store: {
                    id: Variant.storeId,
                    name: Variant.storeName,
                    handle: Variant.handle,
                    active: Variant.active,
                },
                brand: {
                    id: Product.brandId,
                    name: Brand.name
                },
                status: {
                    id: Variant.status,
                    name: Status.name
                },
                variant: {
                    isMain: Variant.main,
                    mainId: Variant.mainId,
                    position: Variant.position
                },
                customizable: Variant.customizable,
                downloadable: Variant.downloadable,
                syncronized: Variant.syncronized,
                history: {
                    createdAt: Variant.createdAt,
                    updatedAt: Variant.updatedAt,
                    deletedAt: Variant.deletedAt
                }
            })
                .from(Variant)
                .leftJoin(Product, eq(Product.id, Variant.productId))
                .leftJoin(Brand, eq(Brand.id, Product.brandId))
                .leftJoin(Status, eq(Status.id, Variant.status))
                .where(
                    and(
                        like(Product.name, `%${terms}%`)
                    )
                )
                .limit(limit)
                .offset(offset)
                .orderBy(asc(Variant.title));
            list.push(...res);
        }
        
        if (active) {
            if (status !== null) {
                if (sorting !== 'asc') {
                    const res = await db.select({
                        id: Variant.id,
                        name: Product.name,
                        sku: Variant.sku,
                        mpn: Variant.mpn,
                        upc: Variant.upc,
                        store: {
                            id: Variant.storeId,
                            name: Variant.storeName,
                            handle: Variant.handle,
                            active: Variant.active,
                        },
                        brand: {
                            id: Product.brandId,
                            name: Brand.name
                        },
                        status: {
                            id: Variant.status,
                            name: Status.name
                        },
                        variant: {
                            isMain: Variant.main,
                            mainId: Variant.mainId,
                            position: Variant.position
                        },
                        customizable: Variant.customizable,
                        downloadable: Variant.downloadable,
                        syncronized: Variant.syncronized,
                        history: {
                            createdAt: Variant.createdAt,
                            updatedAt: Variant.updatedAt,
                            deletedAt: Variant.deletedAt
                        },
                    })
                        .from(Variant)
                        .leftJoin(Product, eq(Product.id, Variant.productId))
                        .leftJoin(Brand, eq(Brand.id, Product.brandId))
                        .leftJoin(Status, eq(Status.id, Variant.status))
                        .where(
                            and(
                                eq(Variant.status, status),
                                eq(Variant.active, true)
                            )
                        )
                        .limit(limit)
                        .offset(offset)
                        .orderBy(desc(Variant.title));
                    list.push(...res);
                }
                const res = await db.select({
                    id: Variant.id,
                    name: Product.name,
                    sku: Variant.sku,
                    mpn: Variant.mpn,
                    upc: Variant.upc,
                    store: {
                        id: Variant.storeId,
                        name: Variant.storeName,
                        handle: Variant.handle,
                        active: Variant.active,
                    },
                    brand: {
                        id: Product.brandId,
                        name: Brand.name
                    },
                    status: {
                        id: Variant.status,
                        name: Status.name
                    },
                    variant: {
                        isMain: Variant.main,
                        mainId: Variant.mainId,
                        position: Variant.position
                    },
                    customizable: Variant.customizable,
                    downloadable: Variant.downloadable,
                    syncronized: Variant.syncronized,
                    history: {
                        createdAt: Variant.createdAt,
                        updatedAt: Variant.updatedAt,
                        deletedAt: Variant.deletedAt
                    }
                })
                    .from(Variant)
                    .leftJoin(Product, eq(Product.id, Variant.productId))
                    .leftJoin(Brand, eq(Brand.id, Product.brandId))
                    .leftJoin(Status, eq(Status.id, Variant.status))
                    .where(
                        eq(Variant.active, true)
                    )
                    .limit(limit)
                    .offset(offset)
                    .orderBy(asc(Variant.title));
                list.push(...res);
            }
            if (sorting !== 'asc') {
                const res = await db.select({
                    id: Variant.id,
                    name: Product.name,
                    sku: Variant.sku,
                    mpn: Variant.mpn,
                    upc: Variant.upc,
                    store: {
                        id: Variant.storeId,
                        name: Variant.storeName,
                        handle: Variant.handle,
                        active: Variant.active,
                    },
                    brand: {
                        id: Product.brandId,
                        name: Brand.name
                    },
                    status: {
                        id: Variant.status,
                        name: Status.name
                    },
                    variant: {
                        isMain: Variant.main,
                        mainId: Variant.mainId,
                        position: Variant.position
                    },
                    customizable: Variant.customizable,
                    downloadable: Variant.downloadable,
                    syncronized: Variant.syncronized,
                    history: {
                        createdAt: Variant.createdAt,
                        updatedAt: Variant.updatedAt,
                        deletedAt: Variant.deletedAt
                    },
                })
                    .from(Variant)
                    .leftJoin(Product, eq(Product.id, Variant.productId))
                    .leftJoin(Brand, eq(Brand.id, Product.brandId))
                    .leftJoin(Status, eq(Status.id, Variant.status))
                    .where(
                        eq(Variant.active, true)
                    )
                    .limit(limit)
                    .offset(offset)
                    .orderBy(desc(Variant.title));
                list.push(...res);
            }
            const res = await db.select({
                id: Variant.id,
                name: Product.name,
                sku: Variant.sku,
                mpn: Variant.mpn,
                upc: Variant.upc,
                store: {
                    id: Variant.storeId,
                    name: Variant.storeName,
                    handle: Variant.handle,
                    active: Variant.active,
                },
                brand: {
                    id: Product.brandId,
                    name: Brand.name
                },
                status: {
                    id: Variant.status,
                    name: Status.name
                },
                variant: {
                    isMain: Variant.main,
                    mainId: Variant.mainId,
                    position: Variant.position
                },
                customizable: Variant.customizable,
                downloadable: Variant.downloadable,
                syncronized: Variant.syncronized,
                history: {
                    createdAt: Variant.createdAt,
                    updatedAt: Variant.updatedAt,
                    deletedAt: Variant.deletedAt
                }
            })
                .from(Variant)
                .leftJoin(Product, eq(Product.id, Variant.productId))
                .leftJoin(Brand, eq(Brand.id, Product.brandId))
                .leftJoin(Status, eq(Status.id, Variant.status))
                .where(
                    eq(Variant.active, true)
                )
                .limit(limit)
                .offset(offset)
                .orderBy(asc(Variant.title));
            list.push(...res);
        }

        if (sorting !== 'asc') {
            if (status !== null) {
                const res = await db.select({
                    id: Variant.id,
                    name: Product.name,
                    sku: Variant.sku,
                    mpn: Variant.mpn,
                upc: Variant.upc,
                store: {
                    id: Variant.storeId,
                    name: Variant.storeName,
                    handle: Variant.handle,
                    active: Variant.active,
                },
                brand: {
                    id: Product.brandId,
                    name: Brand.name
                },
                status: {
                    id: Variant.status,
                    name: Status.name
                },
                variant: {
                    isMain: Variant.main,
                    mainId: Variant.mainId,
                    position: Variant.position
                },
                customizable: Variant.customizable,
                downloadable: Variant.downloadable,
                syncronized: Variant.syncronized,
                history: {
                    createdAt: Variant.createdAt,
                    updatedAt: Variant.updatedAt,
                    deletedAt: Variant.deletedAt
                }
                })
                    .from(Variant)
                    .leftJoin(Product, eq(Product.id, Variant.productId))
                    .leftJoin(Brand, eq(Brand.id, Product.brandId))
                    .leftJoin(Status, eq(Status.id, Variant.status))
                    .where(
                        eq(Variant.status, status)
                    )
                    .limit(limit)
                    .offset(offset)
                    .orderBy(desc(Variant.title));
                list.push(...res);
            } else {
                const res = await db.select({
                    id: Variant.id,
                    name: Product.name,
                    sku: Variant.sku,
                    mpn: Variant.mpn,
                    upc: Variant.upc,
                    store: {
                        id: Variant.storeId,
                        name: Variant.storeName,
                        handle: Variant.handle,
                        active: Variant.active,
                    },
                    brand: {
                        id: Product.brandId,
                        name: Brand.name
                    },
                    status: {
                        id: Variant.status,
                        name: Status.name
                    },
                    variant: {
                        isMain: Variant.main,
                        mainId: Variant.mainId,
                        position: Variant.position
                    },
                    customizable: Variant.customizable,
                    downloadable: Variant.downloadable,
                    syncronized: Variant.syncronized,
                    history: {
                        createdAt: Variant.createdAt,
                        updatedAt: Variant.updatedAt,
                        deletedAt: Variant.deletedAt
                    }
                })
                .from(Variant)
                .leftJoin(Product, eq(Product.id, Variant.productId))
                .leftJoin(Brand, eq(Brand.id, Product.brandId))
                .leftJoin(Status, eq(Status.id, Variant.status))
                .limit(limit)
                .offset(offset)
                .orderBy(desc(Variant.title));
                list.push(...res);
            }
        }
        if (status !== null) {
            const res = await db.select({
                id: Variant.id,
                name: Product.name,
                sku: Variant.sku,
                mpn: Variant.mpn,
                upc: Variant.upc,
                store: {
                    id: Variant.storeId,
                    name: Variant.storeName,
                    handle: Variant.handle,
                    active: Variant.active,
                },
                brand: {
                    id: Product.brandId,
                    name: Brand.name
                },
                status: {
                    id: Variant.status,
                    name: Status.name
                },
                variant: {
                    isMain: Variant.main,
                    mainId: Variant.mainId,
                    position: Variant.position
                },
                customizable: Variant.customizable,
                downloadable: Variant.downloadable,
                syncronized: Variant.syncronized,
                history: {
                    createdAt: Variant.createdAt,
                    updatedAt: Variant.updatedAt,
                    deletedAt: Variant.deletedAt
                }
            })
                .from(Variant)
                .leftJoin(Product, eq(Product.id, Variant.productId))
                .leftJoin(Brand, eq(Brand.id, Product.brandId))
                .leftJoin(Status, eq(Status.id, Variant.status))
                .where(
                    eq(Variant.status, status)
                )
                .limit(limit)
                .offset(offset)
                .orderBy(asc(Variant.title));
            list.push(...res);
        } else {
            const res = await db.select({
                id: Variant.id,
                name: Product.name,
                sku: Variant.sku,
                mpn: Variant.mpn,
                upc: Variant.upc,
                store: {
                    id: Variant.storeId,
                    name: Variant.storeName,
                    handle: Variant.handle,
                    active: Variant.active,
                },
                brand: {
                    id: Product.brandId,
                    name: Brand.name
                },
                status: {
                    id: Variant.status,
                    name: Status.name
                },
                variant: {
                    isMain: Variant.main,
                    mainId: Variant.mainId,
                    position: Variant.position
                },
                customizable: Variant.customizable,
                downloadable: Variant.downloadable,
                syncronized: Variant.syncronized,
                history: {
                    createdAt: Variant.createdAt,
                    updatedAt: Variant.updatedAt,
                    deletedAt: Variant.deletedAt
                }
            })
                .from(Variant)
                .leftJoin(Product, eq(Product.id, Variant.productId))
                .leftJoin(Brand, eq(Brand.id, Product.brandId))
                .leftJoin(Status, eq(Status.id, Variant.status))
                .limit(limit)
                .offset(offset)
                .orderBy(asc(Variant.title));
            list.push(...res);
        }
        return await Promise.all(list.map(async item => {
            const prices = await db.select({
                price: Price.regularPrice,
                discount: Price.disccount,
                online: Price.onlinePrice,
                offer: Price.offerPrice,
                assignedBy: {
                    id: User.id,
                    name: User.name
                },
                category: {
                    id: CategoryPrice.id,
                    name: CategoryPrice.category
                }
            }).from(Price)
            .leftJoin(User, eq(User.id, Price.asignedBy))
            .leftJoin(CategoryPrice, eq(CategoryPrice.id, Price.category))
            .where(eq(Price.variantId, item.id));
            const stocks = await db.select({
                current: Stock.current,
                sucursal: {
                    id: Sucursal.id,
                    name: Sucursal.name
                },
                warehouse: {
                    id: Warehouse.id,
                    name: Warehouse.name
                },
                min: Stock.min,
                max: Stock.max,
                policy: Stock.policy,
                lowStockAlert: Stock.lowStockAlert,
                inventoryId: Stock.inventoryId,
                inventoryQuantity: Stock.inventoryQuantity
            })
            .from(Stock)
            .leftJoin(Sucursal,eq(Sucursal.id,Stock.sucursal))
            .leftJoin(Warehouse,eq(Warehouse.id,Stock.warehouse))
            .where(eq(Stock.variant, item.id));
            return {
                ...item,
                prices: prices,
                stocks: stocks
            };
        }));
    }

    async getAdminListCount(terms: string | null, active: boolean, status: number | null) {
        let total;
        if (terms) {
            if (active) {
                if (status !== null) {
                    total = await db.select({c: count(Variant.id)}).from(Variant).where(
                        and(
                            like(Variant.title, `%${terms}%`),
                            eq(Variant.active, true),
                            eq(Variant.status, status)
                        )
                    ).get();
                } else {
                    total = await db.select({c: count(Variant.id)}).from(Variant).where(
                        and(
                            like(Variant.title, `%${terms}%`),
                            eq(Variant.active, true)
                        )
                    ).get();
                }
            } else {
                if (status !== null) {
                    total = await db.select({c: count(Variant.id)}).from(Variant).where(
                        and(
                            like(Variant.title, `%${terms}%`),
                            eq(Variant.status, status)
                        )
                    ).get();
                } else {
                    total = await db.select({c: count(Variant.id)}).from(Variant).where(
                        and(
                            like(Variant.title, `%${terms}%`)
                        )
                    ).get();
                }
            }
        } else {
            if (active) {
                if (status !== null) {
                    total = await db.select({c: count(Variant.id)}).from(Variant).where(
                        and(
                            eq(Variant.active, true),
                            eq(Variant.status, status)
                        )
                    ).get();
                } else {
                    total = await db.select({c: count(Variant.id)}).from(Variant).where(
                        and(
                            eq(Variant.active, true)
                        )
                    ).get();
                }
            } else {
                if (status !== null) {
                    total = await db.select({c: count(Variant.id)}).from(Variant).where(
                        and(
                            eq(Variant.status, status)
                        )
                    ).get();
                } else {
                    total = await db.select({c: count(Variant.id)}).from(Variant).get();
                }
            }
        }
        return total?.c ?? 0;
    }
}