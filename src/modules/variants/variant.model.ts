import { db } from "@DB/sqlite";
import { Status, Variant } from "@DB/sqlite/schema";
import { eq, or, and } from "drizzle-orm";
import type { Variant as VariantSchema, Variants } from "@Types/schemas/variant";

export class VariantModel {
    async createVariant(productId: number, variant: {
        title: string;
        sku: string;
        mpn: string;
        upc: string;
        ean: string;
        isbn?: string;
        weight?: number;
        weightUnit?: string;
        width?: number;
        height?: number;
        length?: number;
        innerDiameter: number | null;
        outerDiameter: number | null;
        measureUnit: string | null;
        shippingVolume: number | null;
        shippingVolumeUnit: string | null;
        shippingWeight: number | null;
        shippingWeightUnit: string | null;
        customizable: boolean | null;
        customizableFields: unknown;
        downloadable: boolean | null;
        downloadableFiles: unknown;
    }) {
        try {
            if (variant.title && productId && variant.upc) {
                const exists = await db.select().from(Variant)
                    .where(
                        or(
                            eq(Variant.upc, variant.upc),
                            eq(Variant.title, variant.title)
                        )
                    );
                if (exists.length > 0) {
                    return exists[0];
                }
                const result = await db.insert(Variant).values({
                    productId: productId,
                    sku: variant.sku,
                    mpn: variant.mpn,
                    upc: variant.upc,
                    ean: variant.ean,
                    isbn: variant.isbn,
                    weight: variant.weight,
                    weightUnit: variant.weightUnit,
                    width: variant.width,
                    height: variant.height,
                    length: variant.length,
                    innerDiameter: variant.innerDiameter,
                    outerDiameter: variant.outerDiameter,
                    measureUnit: variant.measureUnit,
                    shippingVolume: variant.shippingVolume,
                    shippingVolumeUnit: variant.shippingVolumeUnit,
                    shippingWeight: variant.shippingWeight,
                    shippingWeightUnit: variant.shippingWeightUnit,
                    customizable: variant.customizable,
                    customizableFields: variant.customizableFields,
                    downloadable: variant.downloadable,
                    downloadableFiles: variant.downloadableFiles,
                    status: 1
                }).returning();
                return result ? result[0] : null;
            }
            return null;
        } catch (error) {
            console.error("Create Variant Error: ", error);
            return null;
        }
    }

    async updateVariant(product: number, id: number, data: {
        title?: string;
        sku?: string;
        mpn?: string;
        upc?: string;
        ean?: string;
        isbn?: string;
        weight?: number;
        weightUnit?: string;
        width?: number;
        height?: number;
        length?: number;
        innerDiameter?: number | null;
        outerDiameter?: number | null;
        measureUnit?: string | null;
        shippingVolume?: number | null;
        shippingVolumeUnit?: string | null;
        shippingWeight?: number | null;
        shippingWeightUnit?: string | null;
        customizable?: boolean | null;
        customizableFields?: unknown;
        downloadable?: boolean | null;
        downloadableFiles?: unknown;
    }) {
        try {
            const result = await db.update(Variant)
                .set(data)
                .where(
                    and(
                        eq(Variant.productId, product),
                        eq(Variant.id, id)
                    )
                )
                .returning();
            return result ? result[0] : null;
        } catch (error) {
            console.error("Update Variant Error: ", error);
            return null;
        }
    }

    async getVariantByTitle(title: string) {
        try {
            const result = await db.select().from(Variant)
                .where(eq(Variant.title, title)).get();
            return result ?? null;
        } catch (error) {
            console.error("Get Variant By Title Error: ", error);
            return null;
        }
    }

    async getVariant(productId: number, id: number) {
        try {
            const result = await db.select().from(Variant)
                .where(
                    and(
                        eq(Variant.productId, productId),
                        eq(Variant.id, id)
                    )
                ).get();
            if (!result) return null;
            return this.format(result);
        } catch (error) {
            console.error("Get Variant Error: ", error);
            return null;
        }
    }

    async getProductVariants(productId: number): Promise<Variants> {
        try {
            const result = await db.select().from(Variant)
                .where(eq(Variant.productId, productId));
            return await Promise.all(result.map(async (variant) => {return this.format(variant)}));
        } catch (error) {
            console.error("Get Product Variants Error: ", error);
            return [];
        }
    }

    async getVariantById(id: number): Promise<VariantSchema | null> {
        try {
            const result = await db.select().from(Variant)
                .where(eq(Variant.id, id)).get();
            if (!result) return null;
            return this.format(result);
        } catch (error) {
            console.error("Get Variant By ID Error: ", error);
            return null;
        }
    }

    async format(variant: {
        id: number;
        main: boolean | null;
        mainId: bigint | null;
        storeId: bigint | null;
        storeName: string | null;
        title: string | null;
        handle: string | null;
        position: number | null;
        sku: string | null;
        mpn: string | null;
        upc: string | null;
        ean: string | null;
        isbn: string | null;
        dsin: number | null;
        weight: number|null;
        weightUnit: string|null;
        width: number|null;
        height: number|null;
        length: number|null;
        innerDiameter: number|null;
        outerDiameter: number|null;
        measureUnit: string|null;
        shippingVolume: number|null;
        shippingVolumeUnit: string|null;
        shippingWeight: number|null;
        shippingWeightUnit: string|null;
        customizable: boolean|null;
        customizableFields: unknown;
        downloadable: boolean|null;
        downloadableFiles: unknown;
        productId: number | null;
        status: number | null;
        syncronized: boolean | null;
        active: boolean | null;
        createdAt: Date | null;
        updatedAt: Date | null;
        deletedAt: Date | null;
    }) {
        const status = variant.status ? await db.select({ id: Status.id, name: Status.name }).from(Status).where(eq(Status.id, variant.status)).get() : null;
        return {
            id: variant.id,
            main: variant.main,
            title: variant.title,
            handle: variant.handle,
            position: variant.position,
            store: {
                id: variant.storeId,
                name: variant.storeName,
                syncronized: variant.syncronized,
                mainId: variant.mainId,
                active: variant.active
            },
            sku: variant.sku,
            mpn: variant.mpn,
            upc: variant.upc,
            ean: variant.ean,
            isbn: variant.isbn,
            dsin: variant.dsin,
            productId: variant.productId,
            status: status ?? null,
            weight: {
                value: variant.weight,
                unit: variant.weightUnit
            },
            dimensions: {
                width: {
                    value: variant.width,
                    unit: variant.measureUnit
                },
                height: {
                    value: variant.height,
                    unit: variant.measureUnit
                },
                length: {
                    value: variant.length,
                    unit: variant.measureUnit
                },
                diameter: {
                    inner: {
                        value: variant.innerDiameter,
                        unit: variant.measureUnit
                    },
                    outer: {
                        value: variant.outerDiameter,
                        unit: variant.measureUnit
                    }
                }
            },
            shipping: {
                volume: {
                    value: variant.shippingVolume,
                    unit: variant.shippingVolumeUnit
                },
                weight: {
                    value: variant.shippingWeight,
                    unit: variant.shippingWeightUnit
                }
            },
            customizable: {
                value: variant.customizable,
                fields: JSON.parse(variant.customizableFields as string)
            },
            downloadable: {
                value: variant.downloadable,
                files: JSON.parse(variant.downloadableFiles as string)
            },
            history: {
                createdAt: variant.createdAt,
                updatedAt: variant.updatedAt,
                deletedAt: variant.deletedAt
            }
        };
    }
}