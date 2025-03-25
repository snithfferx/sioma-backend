import { db } from "@DB/sqlite";
import { eq, and, like } from "drizzle-orm";
import { Products, Categories, Brands, Offers, Prices, StoreInformation, CommonNames, ProductRelations, ProductTypes, Tags, TagsProducts, Metadatas, MetadataProductAsociations, ProductStocks, Sucursals, Warehouses, Groups, Country } from "@DB/sqlite/schema";
import { ShopinguiBrand, ShopinguiCategory, ShopinguiCommonName, ShopinguiMetadatas, ShopinguiProductPrice, ShopinguiProductStocks, ShopinguiProductType } from "@Types/schemas/Shopify.schema";

export class ProductModel {
    async getProductsByTerms(terms: string, page: number, limit: number) {
        const list = await db
            .select({
                product: Products,
                origin: Country,
                brand: Brands,
                offer: Offers,
                price: Prices
            })
            .from(Products)
            .leftJoin(Products, eq(Products.id, StoreInformation.product))
            .leftJoin(ProductRelations, eq(ProductRelations.product, Products.id))
            .leftJoin(Brands, eq(Brands.id, ProductRelations.brand))
            .leftJoin(Offers, eq(Offers.product, Products.id))
            .leftJoin(Country, eq(Country.id, ProductRelations.origin))
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
                origin: Country,
                brand: Brands,
                offer: Offers,
                price: Prices,
                relations: ProductRelations
            })
            .from(Products)
            .leftJoin(Brands, eq(Brands.id, ProductRelations.brand))
            .leftJoin(Country, eq(Country.id, ProductRelations.origin))
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

    async getProductsCount() {
        return await db.$count(Products);
    }

    async saveBrand(brand: ShopinguiBrand) {
        const exists = await db
            .select()
            .from(Brands)
            .where(eq(Brands.name, brand.name as string));
        if (exists.length === 0) {
            const newBrand = await db.insert(Brands).values({
                name: brand.name as string,
                description: brand.description as string,
                logo: brand.logo as string,
                active: brand.active as boolean,
            }).returning();
            if (newBrand.length > 0) {
                return newBrand[0];
            }
        }
        return exists[0];
    }

    async saveCategory(category: ShopinguiCategory) {
        const exists = await db.select().from(Categories).where(eq(Categories.name, category.name as string));
        if (exists.length === 0) {
            const newCategory = await db.insert(Categories).values({
                name: category.name as string,
                parents: JSON.stringify(category.parents),
                slug: category.slug,
                active: true
            }).returning();
            if (newCategory.length > 0) {
                return newCategory[0];
            }
        }
        return exists[0];
    }

    async saveProductType(productType: ShopinguiProductType) {
        const exists = await db.select()
            .from(ProductTypes)
            .where(eq(ProductTypes.name, productType.name as string));
        if (exists.length === 0) {
            const productTypeDb = await db.insert(ProductTypes)
                .values({
                    name: productType.name,
                    categories: JSON.stringify([]),
                    isLine: productType.isLine,
                    parents: JSON.stringify([])
                }).returning();
            if (productTypeDb.length > 0) {
                return productTypeDb[0];
            }
        }
        return exists[0];
    }

    async saveProductPrice(product: number, price: ShopinguiProductPrice) {
        const productPriceExists = await db
            .select()
            .from(ProductRelations)
            .where(eq(ProductRelations.product, product));
        if (productPriceExists.length === 0) {
            const productPrice = await db.insert(Prices).values({
                cost: price.cost,
                added: price.added.value,
                value: price.value,
                assignedBy: price.added.asignedBy,
                active: true,
                categoryId: price.category,
                regularPrice: price.store.regular_price,
                salePrice: price.store.sale_price,
                offer: price.store.offer,
            }).returning();
            if (productPrice.length > 0) {
                return productPrice[0];
            }
        }
        return productPriceExists[0];
    }

    async updateProductPrice(price: number, data: ShopinguiProductPrice) {
        const productPriceUpdated = await db.update(Prices)
            .set({
                cost: data.cost,
                added: data.added.value,
                value: data.value,
                assignedBy: data.added.asignedBy,
                active: true,
                categoryId: data.category,
                regularPrice: data.store.regular_price,
                salePrice: data.store.sale_price,
                offer: data.store.offer,
            }).where(eq(Prices.id, price));
        if (productPriceUpdated) {
            return true;
        }
        return false;
    }

    async saveTags(product: number, tags: string[]) {
        const result = await Promise.all(tags.map(async tag => {
            const tagExists = await db
                .select()
                .from(Tags)
                .where(eq(Tags.name, tag));
            if (tagExists.length === 0) {
                const tagDb = await db.insert(Tags).values({
                    name: tag,
                }).returning();
                if (tagDb.length > 0) {
                    await this.relateProductTags(product, tagDb[0].id);
                    return tagDb[0];
                }
            } else {
                const tagData = tagExists[0];
                await this.relateProductTags(product, tagData.id);
                return tagData;
            }
        }));
        return result;
    }

    async relateProductTags(product: number, tag: number) {
        // console.log("tag", tag);
        return await db.insert(TagsProducts).values({
            tag: tag,
            product: product,
        });
    }

    async saveProductRelations(product: number, relations: {
        brand: number,
        category: number[],
        product_type: number,
        price: number,
        store: string,
        dsin: number,
        commonNames: number[],
        stocks: number[],
    }) {
        const productRelationsExists = await db.select().from(ProductRelations).where(eq(ProductRelations.product, product));
        if (productRelationsExists.length === 0) {
            const productRelations = await db.insert(ProductRelations).values({
                product: product,
                status: 1,
                brand: relations.brand,
                dsin: relations.dsin,
                categories: JSON.stringify(relations.category),
                productTypes: JSON.stringify(relations.product_type),
                prices: JSON.stringify(relations.price),
                store: BigInt(relations.store),
                commonNames: JSON.stringify(relations.commonNames),
                stocks: JSON.stringify(relations.stocks)
            }).returning();
            return productRelations[0];
        }
        return productRelationsExists[0];
    }

    async saveProductMetadata(product: number, metadatas: ShopinguiMetadatas) {
        const result = await Promise.all(metadatas.map(async metadata => {
            /* {
                "id": 361,
                "name": "Serie",
                "value": "TM-U",
                "position": 2,
                "active": 1,
                "isFeature": 0,
                "format": null,
                "tooltip": null,
                "allowDescription": 1,
                "group": {
                    "id": "22",
                    "name": "Información del Producto",
                    "order": 1
                }
            }
                
            id: integer().primaryKey(),
            name: text().notNull(),
            position: integer({ mode: 'number' }).default(1),
            active: integer({ mode: 'boolean' }).default(true),
            allow_description: integer({ mode: 'boolean' }).default(true),
            is_feature: integer({ mode: 'boolean' }).default(false),
            format: text(),
            tooltip: text(),*/
            // console.log("Metadata: ", metadata);
            const metadataExists = await db
                .select()
                .from(Metadatas)
                .where(eq(Metadatas.name, metadata.name as string));
            if (metadataExists.length === 0) {
                const groupDb = await this.saveGroup({
                    name: metadata.group?.name as string,
                    position: metadata.group?.order ?? 1
                });
                if (metadata.name !== null) {
                    const productMetadata = await db
                        .insert(Metadatas).values({
                            name: metadata.name,
                            idGroup: groupDb.id,
                            position: metadata.position ?? 1,
                            active: metadata.active == 1 ? true : false,
                            allowDescription: metadata.allowDescription == 1 ? true : false,
                            isFeature: metadata.isFeature == 1 ? true : false,
                            format: metadata.format,
                            tooltip: metadata.tooltip
                        }).returning();
                    if (productMetadata.length > 0) {
                        if (metadata.value !== '') {
                            await this.saveProductMetadataRelations(
                                productMetadata[0].id as number,
                                product,
                                metadata.value as string,
                                metadata.active == 1 ? true : false,
                                metadata.allowDescription == 1 ? true : false);
                        }
                    }
                    return productMetadata[0];
                }
            } else {
                if (metadata.value !== '') {
                    await this.saveProductMetadataRelations(
                        metadataExists[0].id as number,
                        product,
                        metadata.value as string,
                        metadata.active == 1 ? true : false,
                        metadata.allowDescription == 1 ? true : false);
                }
            }
        }));
        return result;
    }

    async saveProductMetadataRelations(metadata: number, product: number, content: string, active: boolean, allowDescription: boolean) {
        const productMetadataRelationExists = await db.select()
            .from(MetadataProductAsociations)
            .where(and(
                eq(MetadataProductAsociations.metadataId, metadata),
                eq(MetadataProductAsociations.productId, product),
            ));
        if (productMetadataRelationExists.length === 0) {
            if (content !== '') {
                await db.insert(MetadataProductAsociations).values({
                    metadataId: metadata,
                    productId: product,
                    content: content,
                    active: active,
                    allowDescription: allowDescription,
                });
            }
        }
    }

    async saveProductCommonName(commonNames: ShopinguiCommonName[]) {
        const commonNamesProduct: number[] = [];
        commonNames.map(async commonName => {
            const productCommonNameExists = await db.select()
                .from(CommonNames)
                .where(eq(CommonNames.name, commonName.name as string));
            if (productCommonNameExists.length === 0) {
                const productCommonName = await db.insert(CommonNames).values({
                    name: commonName.name as string,
                    position: commonName.position as number,
                    storeId: commonName.storeCategory?.storeId as string,
                    storeName: commonName.storeCategory?.name as string,
                    handle: commonName.storeCategory?.handle as string,
                    isLinea: commonName.storeCategory?.isLinea as number > 0 ? true : false,
                }).returning({
                    id: CommonNames.id
                });
                if (productCommonName.length > 0) {
                    commonNamesProduct.push(productCommonName[0].id);
                }
            } else {
                commonNamesProduct.push(productCommonNameExists[0].id);
            }
        });
        return commonNamesProduct;
    }

    async saveProductStocks(product: number, stocks: ShopinguiProductStocks) {
        const stocksDb: number[] = [];
        stocks.sucursals.map(async sucursal => {
            // console.log("Sucursal: ", sucursal.name);
            // console.log("Stocks: ", sucursal.stocks);
            sucursal.stocks.map(async warehouseStock => {
                const sucursalDb = await this.saveSucursal(sucursal.name);
                const warehouse = await this.saveWarehouse(warehouseStock.name, sucursal.name);
                const productStocksExists = await db.select()
                    .from(ProductStocks)
                    .where(
                        and(
                            eq(ProductStocks.product_id, product),
                            eq(ProductStocks.sucursal, sucursalDb.id),
                            eq(ProductStocks.warehouse, warehouse.id),
                        ));
                if (productStocksExists.length === 0) {
                    // console.log("Product Stocks Insert: ", warehouseStock);
                    const productStocks = await db.insert(ProductStocks).values({
                        product_id: product,
                        min: 1,
                        max: warehouseStock.stock * 10,
                        current: warehouseStock.stock,
                        last: 0,
                        sucursal: sucursalDb.id,
                        warehouse: warehouse.id
                    }).returning({ id: ProductStocks.id });
                    if (productStocks.length > 0) {
                        stocksDb.push(productStocks[0].id);
                    }
                } else {
                    //         console.log("Product Stocks: ", productStocksExists);
                    //         console.log("Product Stock updated: ", warehouseStock);
                    const productStoctUpdated = await db.update(ProductStocks).set({
                        current: warehouseStock.stock,
                        last: productStocksExists[0].current
                    }).where(eq(ProductStocks.id, productStocksExists[0].id)).returning({ id: ProductStocks.id });
                    if (productStoctUpdated.length > 0) {
                        stocksDb.push(productStoctUpdated[0].id);
                    }
                }
            });
        });
        return stocksDb;
    }

    async saveWarehouse(name: string, sucursal: string) {
        const sucursalDb = await db.select({ id: Sucursals.id }).from(Sucursals).where(eq(Sucursals.name, sucursal));
        let sucursalId = sucursalDb[0].id;

        if (sucursalDb.length === 0) {
            sucursalId = (await this.saveSucursal(sucursal)).id;
        }
        const warehouseExists = await db.select()
            .from(Warehouses)
            .where(eq(Warehouses.name, name));
        if (warehouseExists.length === 0) {
            const warehouse = await db.insert(Warehouses).values({
                name: name as string,
                sucursal: sucursalId,
                code: ''
            }).returning();
            if (warehouse.length > 0) {
                return warehouse[0];
            }
        }
        return warehouseExists[0];
    }

    async saveSucursal(name: string) {
        const sucursalExists = await db.select()
            .from(Sucursals)
            .where(eq(Sucursals.name, name));
        if (sucursalExists.length === 0) {
            const sucursal = await db.insert(Sucursals).values({
                name: name,
            }).returning();
            if (sucursal.length > 0) {
                return sucursal[0];
            }
        }
        return sucursalExists[0];
    }

    async saveGroup(group: {
        name: string;
        position: number;
    }) {
        const groupExists = await db.select()
            .from(Groups)
            .where(eq(Groups.name, group.name as string));
        if (groupExists.length === 0) {
            const groupDb = await db.insert(Groups).values({
                name: group.name,
                position: group.position
            }).returning();
            if (groupDb.length > 0) {
                return groupDb[0];
            }
        }
        return groupExists[0];
    }
}