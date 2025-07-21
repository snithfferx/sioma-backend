import { db } from "@DB/sqlite";
import { eq, count, and, like, desc, asc } from "drizzle-orm";
import { Category, CategoryAndProductType, CommonName, Metadata, MetadataToProductType, Product, ProductToProductType, ProductType, ProductTypeCommonName } from "@DB/sqlite/schema";
export class ProductTypeModel {

    constructor() { }

    async selectProductTypes() {
        const productTypes = await db.select({
            id: ProductType.id,
            name: ProductType.name,
        }).from(ProductType).where(eq(ProductType.active, true));
        return productTypes;
    }

    async getAll(terms:string | null,page: number=1, limit: number=10, active: boolean=false, sorting:string = 'asc') {
        const offset = page - 1;
        const list = [];
        if (terms) {
            if (active) {
                if (sorting !== 'asc') {
                    const types = await db.select()
                    .from(ProductType)
                    .where(
                        and(
                            eq(ProductType.active, true),
                            like(ProductType.name, `%${terms}%`)
                        )
                    )
                    .limit(limit)
                    .offset(offset)
                    .orderBy(desc(ProductType.name));
                    list.push(...types);
                } else {
                    const types = await db.select()
                    .from(ProductType)
                    .where(
                        and(
                            eq(ProductType.active, true),
                            like(ProductType.name, `%${terms}%`)
                        )
                    )
                    .limit(limit)
                    .offset(offset)
                    .orderBy(asc(ProductType.name));
                    list.push(...types);
                }
            }else{
                if (sorting !== 'asc') {
                    const types = await db.select()
                        .from(ProductType)
                        .where(
                            like(ProductType.name, `%${terms}%`)
                        )
                        .limit(limit)
                        .offset(offset)
                        .orderBy(desc(ProductType.name));
                    list.push(...types);
                } else {
                    const types = await db.select()
                        .from(ProductType)
                        .where(
                            like(ProductType.name, `%${terms}%`)
                        )
                        .limit(limit)
                        .offset(offset)
                        .orderBy(asc(ProductType.name));
                    list.push(...types);
                }
            }
            console.info("list Terms: ", list);
        }
        if (active) {
            if (sorting !== 'asc') {
                const types = await db.select()
                    .from(ProductType)
                    .where(
                        eq(ProductType.active, true)
                    )
                    .limit(limit)
                    .offset(offset)
                    .orderBy(desc(ProductType.name));
                list.push(...types);
            } else {
                const types = await db.select()
                    .from(ProductType)
                    .where(
                        eq(ProductType.active, true)
                    )
                    .limit(limit)
                    .offset(offset)
                    .orderBy(asc(ProductType.name));
                list.push(...types);
            }
            console.info("list Active: ", list);
        }
        if (sorting !== 'asc') {
            const types = await db.select()
                .from(ProductType)
                .limit(limit)
                .offset(offset)
                .orderBy(desc(ProductType.name));
            list.push(...types);
        }else{
        const types = await db.select()
            .from(ProductType)
            .limit(limit)
            .offset(offset)
            .orderBy(asc(ProductType.name));
        list.push(...types);
        console.info("list Sort: ", list);
}
        if (list.length > 0) {
            const result = await Promise.all(list.map( async productType => {
                const children = await db.select({
                    id: ProductType.id,
                    name: ProductType.name,
                    slug: ProductType.slug,
                    active: ProductType.active
                })
                    .from(ProductType)
                    .where(
                        eq(ProductType.parentId, productType.id)
                    )
                    .limit(limit)
                    .offset(offset)
                    .orderBy(desc(ProductType.name));
                return {
                    ...productType,
                    children: children
                }
            }));
            return result;
        }
        return null;
    }

    async getCount(terms:string | null, active: boolean=false) {
        if (terms) {
            if (active) {
                const res= await db.select({ count: count(ProductType.id) })
                .from(ProductType)
                .where(
                    and(
                        eq(ProductType.active, true), 
                        like(ProductType.name, `%${terms}%`)
                    )
                );
                return res[0].count;
            }
            const res= await db.select({ count: count(ProductType.id) })
            .from(ProductType)
            .where(
                and(
                    like(ProductType.name, `%${terms}%`)
                )
            );
            return res[0].count;
        }
        if (active) {
            const res= await db.select({ count: count(ProductType.id) })
            .from(ProductType)
            .where(
                and(
                    eq(ProductType.active, true)
                )
            );
            return res[0].count;
        }
        const res= await db.select({ count: count(ProductType.id) }).from(ProductType);
        return res[0].count;
    }

    async save(productType: {
        name: string;
        parent?: number;
        active?: boolean;
        slug?: string;
    }) {
        const exists = await db
            .select()
            .from(ProductType)
            .where(eq(ProductType.name, productType.name)).get();
        if (exists) return exists;
        const newProductType = await db.insert(ProductType).values({
            name: productType.name,
            parentId: productType.parent ?? null,
            active: productType.active ?? true,
            slug: productType.slug || ''
        }).returning();
        return newProductType.length > 0 ? newProductType[0] : null;
    }

    async create(data: {
        name: string;
        parent?: number;
        active?: boolean;
        slug?: string;
    }) {
        const exists = await db
            .select()
            .from(ProductType)
            .where(eq(ProductType.name, data.name)).get();
        if (exists) return exists;
        const newProductType = await db.insert(ProductType).values({
            name: data.name,
            parentId: data.parent ?? null,
            active: data.active ?? true,
            slug: data.slug || ''
        }).returning();
        return newProductType.length > 0 ? newProductType[0] : null;
    }

    async getById(id: number) {
        const productType = await db
            .select()
            .from(ProductType)
            .where(eq(ProductType.id, id)).get();
        return productType ?? null;
    }

    async update(id: number, productType: {
        name: string;
        parent?: number;
        active?: boolean;
        slug?: string;
    }) {
        const exists = await db
            .select()
            .from(ProductType)
            .where(eq(ProductType.id, id)).get();
        if (!exists) return null;
        const updatedProductType = await db.update(ProductType).set({
            name: productType.name,
            parentId: productType.parent ?? null,
            active: productType.active ?? true,
            slug: productType.slug || ''
        }).where(eq(ProductType.id, id)).returning();
        return updatedProductType.length > 0 ? updatedProductType[0] : null;
    }

    async delete(id: number) {
        const exists = await db
            .select()
            .from(ProductType)
            .where(eq(ProductType.id, id)).get();
        if (!exists) return null;
        const deletedProductType = await db.delete(ProductType).where(eq(ProductType.id, id));
        return deletedProductType ? true : false;
    }

    async getChildrenCount(id: number) {
        const childrenCount = await db.select({
            count: count(ProductType.id)
        }).from(ProductType).where(eq(ProductType.parentId, id)).get();
        return childrenCount?.count ?? 0;
    }

    async getChildren(id: number) {
        const children = await db.select({
            id: ProductType.id,
            name: ProductType.name,
            slug: ProductType.slug,
            active: ProductType.active,
            parentId: ProductType.parentId
        }).from(ProductType).where(eq(ProductType.parentId, id));
        return children;
    }

    async getProductsCount(id: number) {
        const productsCount = await db.select({
            count: count(ProductToProductType.id)
        }).from(ProductToProductType).where(eq(ProductToProductType.productTypeId, id)).get();
        return productsCount?.count ?? 0;
    }

    async getProducts(id: number) {
        const products = await db.select({
            id: Product.id,
            name: Product.name,
            productTypeId: ProductToProductType.productTypeId
        })
        .from(Product)
        .leftJoin(ProductToProductType, eq(ProductToProductType.productId,Product.id))
        .where(eq(ProductToProductType.productTypeId, id));
        return products;
    }

    async getCategoriesCount(id: number) {
        const categoriesCount = await db.select({
            count: count(CategoryAndProductType.id)
        }).from(CategoryAndProductType).where(eq(CategoryAndProductType.productTypeId, id)).get();
        return categoriesCount?.count ?? 0;
    }

    async getCategories(id: number) {
        const categories = await db.select({
            id: Category.id,
            name: Category.name,
            productTypeId: CategoryAndProductType.productTypeId
        })
        .from(Category)
        .leftJoin(CategoryAndProductType, eq(CategoryAndProductType.categoryId,Category.id))
        .where(eq(CategoryAndProductType.productTypeId, id));
        return categories;
    }

    async getMetadataCount(id: number) {
        const metadataCount = await db.select({
            count: count(MetadataToProductType.id)
        }).from(MetadataToProductType).where(eq(MetadataToProductType.productTypeId, id)).get();
        return metadataCount?.count ?? 0;
    }

    async getMetadata(id: number) {
        const metadata = await db.select({
            id: Metadata.id,
            name: Metadata.name,
            productTypeId: MetadataToProductType.productTypeId
        })
        .from(Metadata)
        .leftJoin(MetadataToProductType, eq(MetadataToProductType.metadataId,Metadata.id))
        .where(eq(MetadataToProductType.productTypeId, id));
        return metadata;
    }

    async getCommonNameCount(id: number) {
        const commonNameCount = await db.select({
            count: count(ProductTypeCommonName.id)
        }).from(ProductTypeCommonName).where(eq(ProductTypeCommonName.productTypeId, id)).get();
        return commonNameCount?.count ?? 0;
    }

    async getCommonName(id: number) {
        const commonName = await db.select({
            id: CommonName.id,
            name: CommonName.name,
            productTypeId: ProductTypeCommonName.productTypeId
        })
        .from(CommonName)
        .leftJoin(ProductTypeCommonName, eq(ProductTypeCommonName.commonNameId,CommonName.id))
        .where(eq(ProductTypeCommonName.productTypeId, id));
        return commonName;
    }
}