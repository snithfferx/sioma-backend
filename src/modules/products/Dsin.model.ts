import { db } from "@DB/mysql";
import { eq, like, and } from "drizzle-orm";
import {
    Products,
    ProductStore,
    ProductTypes,
    BrandRelations,
    Categories,
    Countries,
    Brands,
    CommonName,
    ClientCategories,
    AddedValues,
    OfferPrice,
    AverageCost,
    Warehouses
} from "@DB/mysql/schema";
import { DsinProductSchema } from "@Types/schemas/Dsin.schema";
import { ShopinguiProduct, ShopinguiBrand, ShopinguiCategory, ShopinguiCommonName, ShopinguiProductType, ShopinguiProductPrice, ShopinguiProductStocks, ShopinguiMetadatas } from "@Types/schemas/Shopify.schema";
import { generateSlug } from "@Utils/slug";
import { db as sqliteDb } from "@DB/sqlite";
import {
    Prices,
    ProductRelations,
    Brands as BrandsL,
    Categories as CategoriesL,
    Tags,
    CommonNames,
    Groups,
    ProductStocks,
    TagsProducts,
    Metadatas,
    MetadataProductAsociations
} from "@DB/sqlite/schema";

export class DsinModel {
    async getProductsByTerms(terms: string, page: number, limit: number) {
        const list = await db
            .select({
                product: {
                    id: Products.id,
                    name: Products.name,
                    sku: Products.sku,
                    upc: Products.upc,
                    mpn: Products.mpn,
                    image: Products.image,
                    weight: Products.weight,
                    shortDescription: Products.shortDescription,
                    longDescription: Products.longDescription,
                    min: Products.defaultMinStock,
                    max: Products.defaultMaxStock,
                    warranty: Products.defaultWarranty,
                    storeId: ProductStore.productStoreId,
                    storeStatus: ProductStore.storeStatus,
                },
                origin: Countries,
                category: {
                    id: Categories.id,
                    name: Categories.name
                },
                brand: Brands,
                offer: {
                    end: Products.offerEnd,
                    isOffer: Products.offer,
                    value: OfferPrice.price,
                    store: ProductStore.offerPrice,
                    isStoreActive: ProductStore.activeOffer,
                    collect: ProductStore.offerCollect
                },
                price: {
                    cost: AverageCost.cost,
                    total: AverageCost.total,
                    asignBy: AverageCost.user,
                    added: AddedValues.added,
                    updatedAt: AddedValues.changeDate,
                    store: ProductStore.storePrice,
                    client: ClientCategories.name,
                    category: ClientCategories.id

                },
                commonName: CommonName,
                combo: {
                    combo: ProductStore.combo,
                    id: ProductStore.comboId
                },
                bundle: {
                    bundle: ProductStore.bundle,
                    id: ProductStore.productBundleId
                },
                dsComputer: {
                    dsComputer: ProductStore.inDsComputer,
                    id: ProductStore.idDsComputer
                },
                variant: {
                    isVariant: ProductStore.isVariant,
                    id: ProductStore.variantId,
                    title: ProductStore.variantTitle,
                    main: ProductStore.mainVariant
                },
            })
            .from(ProductStore)
            .leftJoin(Products, eq(Products.id, ProductStore.productId))
            .leftJoin(ProductTypes, eq(Products.productType, ProductTypes.id))
            .leftJoin(Categories, eq(ProductTypes.category, Categories.id))
            .leftJoin(BrandRelations, eq(Products.id, BrandRelations.productId))
            .leftJoin(Brands, eq(BrandRelations.brandId, Brands.id))
            .leftJoin(Countries, eq(Countries.id, Products.origin))
            .leftJoin(CommonName, eq(CommonName.name, ProductStore.commonName))
            .leftJoin(AverageCost, eq(AverageCost.product, Products.id))
            .leftJoin(OfferPrice, eq(OfferPrice.product, Products.id))
            .leftJoin(AddedValues, eq(AddedValues.product, Products.id))
            .leftJoin(ClientCategories, eq(ClientCategories.id, AddedValues.clientCategory))
            .where(
                and(
                    like(Products.name, `%${terms}%`),
                    like(Products.sku, `%${terms}%`),
                    like(Products.upc, `%${terms}%`),
                    like(Products.mpn, `%${terms}%`),
                    eq(Products.refurbished, 'false'),
                    eq(Products.disabled, 0),
                    eq(AddedValues.clientCategory, ProductTypes.priceCategory)
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
                product: {
                    id: Products.id,
                    name: Products.name,
                    sku: Products.sku,
                    upc: Products.upc,
                    mpn: Products.mpn,
                    image: Products.image,
                    weight: Products.weight,
                    shortDescription: Products.shortDescription,
                    longDescription: Products.longDescription,
                    min: Products.defaultMinStock,
                    max: Products.defaultMaxStock,
                    warranty: Products.defaultWarranty,
                    storeId: ProductStore.productStoreId,
                    storeStatus: ProductStore.storeStatus,

                },
                origin: Countries,
                type: {
                    id: ProductTypes.id,
                    name: ProductTypes.name
                },
                category: {
                    id: Categories.id,
                    name: Categories.name
                },
                brand: Brands,
                offer: {
                    end: Products.offerEnd,
                    isOffer: Products.offer,
                    value: OfferPrice.price,
                    store: ProductStore.offerPrice,
                    isStoreActive: ProductStore.activeOffer,
                    collect: ProductStore.offerCollect
                },
                price: {
                    cost: AverageCost.cost,
                    total: AverageCost.total,
                    asignBy: AverageCost.user,
                    added: AddedValues.added,
                    updatedAt: AddedValues.changeDate,
                    store: ProductStore.storePrice,
                    client: ClientCategories.name,
                    category: ClientCategories.id

                },
                commonName: CommonName,
                combo: {
                    combo: ProductStore.combo,
                    id: ProductStore.comboId
                },
                bundle: {
                    bundle: ProductStore.bundle,
                    id: ProductStore.productBundleId
                },
                dsComputer: {
                    dsComputer: ProductStore.inDsComputer,
                    id: ProductStore.idDsComputer
                },
                variant: {
                    isVariant: ProductStore.isVariant,
                    id: ProductStore.variantId,
                    title: ProductStore.variantTitle,
                    main: ProductStore.mainVariant
                },
            })
            .from(Products)
            .leftJoin(ProductStore, eq(ProductStore.productId, Products.id))
            .leftJoin(ProductTypes, eq(Products.productType, ProductTypes.id))
            .leftJoin(Categories, eq(ProductTypes.category, Categories.id))
            .leftJoin(BrandRelations, eq(Products.id, BrandRelations.productId))
            .leftJoin(Brands, eq(BrandRelations.brandId, Brands.id))
            .leftJoin(Countries, eq(Countries.id, Products.origin))
            .leftJoin(CommonName, eq(CommonName.name, ProductStore.commonName))
            .leftJoin(AverageCost, eq(AverageCost.product, Products.id))
            .leftJoin(OfferPrice, eq(OfferPrice.product, Products.id))
            .leftJoin(AddedValues, eq(AddedValues.product, Products.id))
            .leftJoin(ClientCategories, eq(ClientCategories.id, AddedValues.clientCategory))
            .where(
                and(
                    eq(Products.refurbished, 'false'),
                    eq(Products.disabled, 0),
                    eq(AddedValues.clientCategory, ProductStore.productPrice)
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

    getProductsCount() {
        return db.$count(Products);
    }

    async getProductById(id: number): Promise<DsinProductSchema | null> {
        const product = await db
            .select({
                product: {
                    id: Products.id,
                    name: Products.name,
                    sku: Products.sku,
                    upc: Products.upc,
                    mpn: Products.mpn,
                    image: Products.image,
                    weight: Products.weight,
                    shortDescription: Products.shortDescription,
                    longDescription: Products.longDescription,
                    min: Products.defaultMinStock,
                    max: Products.defaultMaxStock,
                    warranty: Products.defaultWarranty,
                    storeId: ProductStore.productStoreId,
                    storeStatus: ProductStore.storeStatus,

                },
                origin: Countries,
                type: {
                    id: ProductTypes.id,
                    name: ProductTypes.name
                },
                category: {
                    id: Categories.id,
                    name: Categories.name
                },
                brand: Brands,
                offer: {
                    end: Products.offerEnd,
                    isOffer: Products.offer,
                    value: OfferPrice.price,
                    store: ProductStore.offerPrice,
                    isStoreActive: ProductStore.activeOffer,
                    collect: ProductStore.offerCollect
                },
                price: {
                    cost: AverageCost.cost,
                    total: AverageCost.total,
                    asignBy: AverageCost.user,
                    added: AddedValues.added,
                    updatedAt: AddedValues.changeDate,
                    store: ProductStore.storePrice,
                    client: ClientCategories.name,
                    category: ClientCategories.id

                },
                commonName: CommonName,
                combo: {
                    combo: ProductStore.combo,
                    id: ProductStore.comboId
                },
                bundle: {
                    bundle: ProductStore.bundle,
                    id: ProductStore.productBundleId
                },
                dsComputer: {
                    dsComputer: ProductStore.inDsComputer,
                    id: ProductStore.idDsComputer
                },
                variant: {
                    isVariant: ProductStore.isVariant,
                    id: ProductStore.variantId,
                    title: ProductStore.variantTitle,
                    main: ProductStore.mainVariant
                },
            })
            .from(Products)
            .leftJoin(ProductStore, eq(ProductStore.productId, Products.id))
            .leftJoin(ProductTypes, eq(Products.productType, ProductTypes.id))
            .leftJoin(Categories, eq(ProductTypes.category, Categories.id))
            .leftJoin(BrandRelations, eq(Products.id, BrandRelations.productId))
            .leftJoin(Brands, eq(BrandRelations.brandId, Brands.id))
            .leftJoin(Countries, eq(Countries.id, Products.origin))
            .leftJoin(CommonName, eq(CommonName.name, ProductStore.commonName))
            .leftJoin(AverageCost, eq(AverageCost.product, Products.id))
            .leftJoin(OfferPrice, eq(OfferPrice.product, Products.id))
            .leftJoin(AddedValues, eq(AddedValues.product, Products.id))
            .leftJoin(ClientCategories, eq(ClientCategories.id, AddedValues.clientCategory))
            .where(and(
                eq(Products.id, id),
                eq(Products.refurbished, 'false'),
                eq(AddedValues.clientCategory, ProductStore.productPrice)
            ));
        return product.length > 0 ? product[0] : null;
    }

    /**
     * Extracts the weight and unit from a given weight string.
     *
     * @param weight - A string representing the weight, which may include a unit 
     *                 (e.g., "2.1kg", "2.1lb", "2.1oz", "2.1g", or "2.1").
     *                 If null or undefined, the function returns a default weight of 0.0 grams.
     * @returns An object containing:
     *          - weight: A number representing the extracted weight.
     *          - unit: A string representing the unit of the weight (e.g., "kg", "lb", "oz", "g").
     *                 If no unit is provided, defaults to "g".
     */
    extractWeight(weight: string | null | undefined) {
        let w = 0, u = '';
        if (weight == null || weight == undefined || weight == '') return { weight: 0.0, unit: 'g' };
        // weight: "2.1kg" || "2.1lb" || "2.1oz" || "2.1g" || "2.1" || "2.1 lb"
        // substract from the last two characters
        const lastChar = weight.substring(weight.length - 1, weight.length);
        // console.log("lastChar", lastChar);
        const pLastChar = weight.substring(weight.length - 2, weight.length);
        // console.log("pLastChar", pLastChar);
        if (isNaN(Number(lastChar))) {
            if (isNaN(Number(pLastChar))) {
                u += pLastChar + lastChar;
                w = Number(weight.substring(weight.length - 2, weight.length - 1).trim());
            } else {
                u += lastChar;
                w = Number(weight.substring(weight.length - 1, weight.length).trim());
            }
        } else {
            if (isNaN(Number(pLastChar)) && pLastChar === '.') {
                u = 'g';
                w = Number(weight);
            } else {
                u = 'g';
                w = Number(weight);
            }
        }
        return { weight: w, unit: u };
    }

    /**
     * Generates a slug (handle) for a product based on its name, brand and sku/mpn.
     *
     * @param product - The product to generate the slug for.
     * @returns The generated slug.
     */
    generateHandle(product: ShopinguiProduct) {
        let commonName = 'Sin Nombre Común';
        let common: ShopinguiCommonName | null = product.commonName.length > 0 ? product.commonName[0] : null;
        if (common !== null) {
            commonName = common.name ?? 'Sin Nombre Común';
        }
        const brand = product.brand?.name ?? '';
        let skuMpn = '';
        if (product.sku) {
            skuMpn = product.sku;
        } else {
            if (product.mpn) {
                skuMpn = product.mpn;
            }
        }
        const title = `${commonName} ${brand} ${skuMpn}`;
        return generateSlug(title);
    }

    generateLongDescription(product: ShopinguiProduct) {
        let tags = '';
        if (product.tags) {
            tags = product.tags.map(tag => {
                const tagSlug = slugify(tag);
                return `<a class="btn btn-outline-primary mr-1 mb-2" href="${tagSlug}">
                    <span class="badge badge-pill badge-primary">${tag}</span>
                </a>`;
            }).join('');
        }
        let contentTable = '';
        if (product.metadata) {
            let metadataString = '';
            let featureString = '';
            const groupIds = [
                ...new Set(
                    product.metadata
                        .map((m: ShopinguiMetadata) => m.group?.id)
                        .filter(Boolean),
                ),
            ];
            groupIds.map(groupId => {
                let groupName = '';
                product.metadata.map(metadata => {
                    if (metadata.group?.id === groupId) {
                        if (metadata.value !== '0') {
                            metadataString += `<tr><td class="tableCellMeta">${metadata.name}</td><td class="tableCellMeta">${metadata.value}</td></tr>`;
                        } else {
                            featureString += `<tr><td class="tableCellMeta">${metadata.name}</td><td class="tableCellContent">&#10004</td></tr>`;
                        }
                        groupName = metadata.group.name as string;
                    }
                });
                contentTable += `<tr><td class="tableCellGroupTitle">${groupName}</td><td class="tableCellGroupTitleContent"></td>${metadataString}${featureString}</tr>`;
            });
        }
        let commonName = 'Sin Nombre Común';
        let common: ShopinguiCommonName | null = product.commonName.length > 0 ? product.commonName[0] : null;
        if (common !== null) {
            commonName = common.name ?? 'Sin Nombre Común';
        }
        const commonNameSlug = slugify(commonName);
        const brand = product.brand?.name;
        const brandSlug = slugify(`${commonName} ${brand}`);

        return `<style>.nav-tabs .nav-item.show .nav-link, .nav-tabs .nav-link .active {background: #f5f5f5;border-bottom: 2px solid #036cbf;border-radius: 5px 5px 0px 0px;} .tableCellMeta {border: 1px solid #fbfbfb;padding: 3px 0px 3px 15px;vertical-align: middle;background-color: #fdfdfd;width: 50%;} .tableCellContent {text-align: center;border: 1px solid #fbfbfb;padding: 3px 0px 3px 15px;vertical-align: middle;background-color: #fafafa;width: 50%;} .tableCellGroupTitle {border: 1px solid #f8f8f8;padding: 3px 0px 3px 5px;vertical-align: middle;background-color: #f7f7f7;font-weight: 800;text-transform: uppercase;text-align: center;} .tableCellGroupTitleContent {border: 1px solid #fbfbfb;padding: 3px 0px 3px 15px;vertical-align: middle;background-color: #fafafa;width: 50%;}</style>
        <div class="col-sm-8 col-offset-sm-2 col-md-10 offset-md-1 mb-3">
        <h6 class="tt-title-sub text-center"> ESPECIFICACIONES DEL PRODUCTO </h6>
        <div class="div-drop"><table id="table001" width="100%" class="NEW-TABLE TableOverride-1 tab-drag" style="margin: auto"><tbody>${contentTable}</tbody></table></div></div><hr>
        <div class='col-sm-8 col-offset-sm-2 col-md-10 offset-md-1 align-content-center mt-2'>
        <h6 class='tt-title-sub text-center mb-2'>BÚSQUEDAS RELACIONADAS</h6>
        <a class="btn btn-outline-primary mr-1 mb-2" href="https://digitalsolutions.com.sv/collections/${commonNameSlug}">${commonName}</a>
        <a class="btn btn-outline-primary mr-1 mb-2" href="https://digitalsolutions.com.sv/collections/${brandSlug}">${brand}</a>${tags}</div>`;
    }

    generateShortDescription(product: ShopinguiProduct) {
        let metadataString = '';
        let featureString = '';
        let htmlString = '<p>';
        const groupIds = [
            ...new Set(
                product.metadata
                    .map((m: ShopinguiMetadata) => m.group?.id)
                    .filter(Boolean),
            ),
        ];
        const groupIdsLength = groupIds.length;
        groupIds.map((groupId, index) => {
            let groupName = '';
            product.metadata.map(metadata => {
                if (metadata.group?.id === groupId) {
                    if (metadata.value !== '0') {
                        metadataString += `<br>&nbsp;&nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;<strong>${metadata.name}</strong> : <em>${metadata.value}</em>`;
                    } else {
                        featureString += `<br>&nbsp;&nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;<strong>${metadata.name}</strong> : <em>&#10004</em>`;
                    }
                    groupName = `<strong>${metadata.group?.name}</strong>`;
                }
            });
            htmlString += `<strong>${groupName}</strong><br>${metadataString}${featureString}`;
            if (index < groupIdsLength) {
                htmlString += `<br><br>`;
            }
        });
        htmlString += '</p>';
        return htmlString;
    }

    generateTitle(product: ShopinguiProduct) {
        let commonName = 'Sin Nombre Común';
        let common: ShopinguiCommonName | null = product.commonName.length > 0 ? product.commonName[0] : null;
        if (common !== null) {
            commonName = common.name ?? 'Sin Nombre Común';
        }
        const brand = product.brand?.name ?? '';
        let skuMpn = '';
        if (product.sku) {
            skuMpn = product.sku;
        } else {
            if (product.mpn) {
                skuMpn = product.mpn;
            }
        }
        return `${commonName} ${brand} ${skuMpn}`;
    }

    makeItRound(number: number) {
        const amountStr = number.toString();
        const amountParts = amountStr.split('.');
        let integerPart = parseInt(amountParts[0]);
        let decimalPart = parseInt(amountParts[1]);
        if (decimalPart > 0 && decimalPart < 50) {
            integerPart = 50;
        } else if (decimalPart > 50 && decimalPart < 100) {
            integerPart = 90;
        } else {
            integerPart = 99;
        }
        return parseFloat(integerPart + '.' + decimalPart);
    }

    async saveBrand(brand: ShopinguiBrand) {
        const brandExists = await sqliteDb.select()
            .from(BrandsL)
            .where(eq(BrandsL.name, brand.name as string));
        if (brandExists.length === 0) {
            const brandDb = await sqliteDb.insert(BrandsL).values({
                name: brand.name as string
            }).returning();
            if (brandDb.length > 0) {
                return brandDb[0];
            }
        }
        return brandExists[0];
    }

    async saveCategory(category: ShopinguiCategory) {
        const categoryExists = await sqliteDb.select()
            .from(CategoriesL)
            .where(eq(CategoriesL.name, category.name as string));
        if (categoryExists.length === 0) {
            const categoryDb = await sqliteDb.insert(CategoriesL)
                .values({
                    name: category.name as string,
                    slug: generateSlug(category.name as string),
                    parents: category.parents,
                    active: true
                }).returning();
            if (categoryDb.length > 0) {
                return categoryDb[0];
            }
        }
        return categoryExists[0];
    }

    async saveProductType(productType: ShopinguiProductType) {
        const productTypeExists = await db.select()
            .from(ProductTypes)
            .where(eq(ProductTypes.name, productType.name as string));
        if (productTypeExists.length === 0) {
            const productTypeDb = await db.insert(ProductTypes)
                .values({
                    name: productType.name,
                    category: productType.category,
                    isLine: productType.isLine,
                    priceCategory: productType.priceCategory,
                });
            if (productTypeDb.length > 0) {
                return productTypeDb[0];
            }
        }
        return productTypeExists[0];
    }

    async saveProductPrice(product: number, price: ShopinguiProductPrice) {
        const productPriceExists = await sqliteDb
            .select()
            .from(ProductRelations)
            .where(eq(ProductRelations.product, product));
        if (productPriceExists.length === 0) {
            const productPrice = await sqliteDb.insert(Prices).values({
                cost: price.cost,
                added: price.added.value,
                value: price.value,
                assignedBy: price.added.asignedBy,
                active: true,
                categoryId: price.category,
                regularPrice: this.makeItRound(price.store.regular_price),
                salePrice: this.makeItRound(price.store.sale_price),
                offer: price.store.offer,
            }).returning();
            if (productPrice.length > 0) {
                return productPrice[0];
            }
        }
        return productPriceExists[0];
    }

    async updateProductPrice(price: number, data: ShopinguiProductPrice) {
        const productPriceUpdated = await sqliteDb.update(Prices)
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
            const tagExists = await sqliteDb
                .select()
                .from(Tags)
                .where(eq(Tags.name, tag));
            if (tagExists.length === 0) {
                const tagDb = await sqliteDb.insert(Tags).values({
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
        return await sqliteDb.insert(TagsProducts).values({
            tagId: tag,
            productId: product,
        });
    }

    async saveProductRelations(product: number, relations: {
        brand: number,
        category: number,
        product_type: number,
        price: number,
        store: string,
        dsin: number,
        commonNames: number[],
        stocks: number[],
    }) {
        const productRelationsExists = await sqliteDb.select().from(ProductRelations).where(eq(ProductRelations.productId, product));
        if (productRelationsExists.length === 0) {
            const productRelations = await sqliteDb.insert(ProductRelations).values({
                productId: product,
                brandId: relations.brand,
                productTypeId: relations.product_type,
                price: relations.price,
                store: relations.store,
                dsin: relations.dsin,
                status_id: 5,
                category_id: relations.category,
                commonNames: JSON.stringify(relations.commonNames),
                stocks: JSON.stringify(relations.stocks),
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
            const metadataExists = await sqliteDb
                .select()
                .from(Metadatas)
                .where(eq(Metadatas.name, metadata.name as string));
            if (metadataExists.length === 0) {
                const groupDb = await this.saveGroup({
                    name: metadata.group?.name as string,
                    position: metadata.group?.order ?? 1
                });
                if (metadata.name !== null) {
                    const productMetadata = await sqliteDb
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
        const productMetadataRelationExists = await sqliteDb.select()
            .from(MetadataProductAsociations)
            .where(and(
                eq(MetadataProductAsociations.metadataId, metadata),
                eq(MetadataProductAsociations.productId, product),
            ));
        if (productMetadataRelationExists.length === 0) {
            if (content !== '') {
                await sqliteDb.insert(MetadataProductAsociations).values({
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
            const productCommonNameExists = await sqliteDb.select()
                .from(CommonNames)
                .where(eq(CommonNames.name, commonName.name as string));
            if (productCommonNameExists.length === 0) {
                const productCommonName = await sqliteDb.insert(CommonNames).values({
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
        const sucursalDb = await db.select({ id: TSucursals.id }).from(TSucursals).where(eq(TSucursals.name, sucursal));
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
                sucursal: sucursalId
            }).returning();
            if (warehouse.length > 0) {
                return warehouse[0];
            }
        }
        return warehouseExists[0];
    }

    async saveSucursal(name: string) {
        const sucursalExists = await db.select()
            .from(TSucursals)
            .where(eq(TSucursals.name, name));
        if (sucursalExists.length === 0) {
            const sucursal = await db.insert(TSucursals).values({
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