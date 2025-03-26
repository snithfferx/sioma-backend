import { db } from "@DB/sqlite";
import { eq, count } from "drizzle-orm";
import { ProductTypes } from "@DB/sqlite/schema";

export class ProductTypeModel {
    async getAllProductTypes() {
        const list = await db
            .select({
                productType: ProductTypes,
            })
            .from(ProductTypes)
            .limit(100);
        // count records
        const total = await this.getProductTypesCount();
        // const product = products;
        if (!list) {
            return Error("ProductType not found");
        }
        // Total pages
        const totalPages = Math.ceil(total[0].count / 100);
        return {
            data: list,
            current: 1,
            limit: 100,
            total: totalPages
        }
    }

    async getProductTypesCount() {
        return await db.select({ count: count(ProductTypes.id) }).from(ProductTypes);
    }

    async saveProductType(productType: any) {
        const exists = await db
            .select()
            .from(ProductTypes)
            .where(eq(ProductTypes.name, productType.name as string));
        if (exists.length === 0) {
            const newProductType = await db.insert(ProductTypes).values({
                name: productType.name as string,
                parents: JSON.stringify(productType.parents),
                slug: productType.slug,
                active: true
            }).returning();
            if (newProductType.length > 0) {
                return newProductType[0];
            }
        }
        return exists[0];
    }

    async getProductTypeById(id: number) {
        const productType = await db
            .select({
                productType: ProductTypes,
            })
            .from(ProductTypes)
            .where(eq(ProductTypes.id, id));
        if (!productType) {
            return Error("ProductType not found");
        }
        return productType[0];
    }
}