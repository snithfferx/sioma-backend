import { db } from "@DB/mysql";
import { eq, like, and, ne } from "drizzle-orm";
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
    AverageCost
} from "@DB/mysql/schema";
import { DsinProductSchema } from "@Types/schemas/Dsin.schema";
import { ShopinguiProduct, ShopinguiCommonName, ShopinguiMetadata } from "@Types/schemas/Shopify.schema";
import { generateSlug } from "@Utils/slug";

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
        return db.$count(ProductStore, ne(ProductStore.commonName, ''));
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
                const tagSlug = generateSlug(tag);
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
        const commonNameSlug = generateSlug(commonName);
        const brand = product.brand?.name;
        const brandSlug = generateSlug(`${commonName} ${brand}`);

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
}