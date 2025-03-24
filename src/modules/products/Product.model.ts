import { db } from "@DB/sqlite";
import { eq, and, or, like, relations } from "drizzle-orm";
import { Products, Countries, Categories, Brands, Offers, Prices, StoreInformation, CommonNames,  ProductRelations } from "@DB/sqlite/schema";

export class ProductModel {
    async getProductsByTerms(terms: string, page: number, limit: number) {
        const list = await db
            .select({
                product: Products,
                origin: Countries,
                brand: Brands,
                offer: Offers,
                price: Prices
            })
            .from(Products)
            .leftJoin(Products, eq(Products.id, StoreInformation.product))
            .leftJoin(ProductRelations, eq(ProductRelations.product, Products.id))
            .leftJoin(Brands, eq(Brands.id, ProductRelations.brand))
            .leftJoin(Offers, eq(Offers.product, Products.id))
            .leftJoin(Countries, eq(Countries.id, ProductRelations.origin))
            .leftJoin(Prices, eq(Prices.id, ProductRelations.prices))
            .where(
                and(
                    like(Products.name, `%${terms}%`),
                    like(Products.sku, `%${terms}%`),
                    like(Products.upc, `%${terms}%`),
                    like(Products.mpn, `%${terms}%`),
                ),
            )
            .limit(limit)
            .offset((page - 1) * limit);
        // count records
        const total = await this.getProductsCount();
        // const product = products;
        if (!list) {
            return Error("Product not found");
        }
        // Total pages
        const totalPages = Math.ceil(total / limit);
        return {
            data: list,
            current: page,
            limit: limit,
            total: totalPages
        }
    }

    async getAllProducts(page: number, limit: number) {
        const list = await db
            .select({
                product: Products,
                origin: Countries,
                brand: Brands,
                offer: Offers,
                price: Prices,
                relations: ProductRelations
            })
            .from(Products)
            .leftJoin(Brands, eq(Brands.id, ProductRelations.brand))
            .leftJoin(Countries, eq(Countries.id, ProductRelations.origin))
            .leftJoin(Offers, eq(Offers.product, Products.id))
            .leftJoin(Prices, eq(Prices.id, ProductRelations.prices))
            .leftJoin(ProductRelations, eq(ProductRelations.product, Products.id))
            .limit(limit)
            .offset((page - 1) * limit);

        // count records
        const total = await this.getProductsCount();
        // const product = products;
        if (!list) {
            return Error("Product not found");
        }
        // Total pages
        const totalPages = Math.ceil(total / limit);
        return {
            data: list,
            current: page,
            limit: limit,
            total: totalPages
        }
    }

    async getProductById(id: number): Promise<DsinProductSchema | null> {
        const product = await db
            .select({
                product: Products,
                origin: Countries,
                brand: Brands,
                offer: Offers,
                price: Prices,
                relations: ProductRelations
            })
            .from(Products)
            .leftJoin(Brands, eq(ProductRelations.brand, Brands.id))
            .leftJoin(Countries, eq(Countries.id, ProductRelations.origin))
            .leftJoin(Offers, eq(Offers.product, Products.id))
            .leftJoin(Prices, eq(Prices.id, ProductRelations.prices))
            .leftJoin(ProductRelations, eq(ProductRelations.product, Products.id))
            .where(
                and(
                    eq(Products.id, id)
                )
            );
        return product.length > 0 ? product[0] : null;
    }

    async getProductsCount() {
        return await db.$count(Products);
    }
}