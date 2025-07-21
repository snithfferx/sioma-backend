import { VariantModel } from "@Modules/variants/variant.model";
import type { Variant } from "@Types/validators/product";
export class VariantsController {
    model = new VariantModel();
    constructor() { }
    /**
     * Create a new variant
     * @param productId 
     * @param variant 
     * @returns 
     */
    async createVariant(productId: number, variant: Variant) {
        const result = await this.model.createVariant(productId, variant);
        return result;
    }
    /**
     * Update a variant
     * @param productId 
     * @param variantId 
     * @param data 
     * @returns 
     */
    async updateVariant(productId: number, variantId: number, data: Variant) {
        const result = await this.model.updateVariant(productId, variantId, data);
        return result;
    }
    /**
     * Look variant by title and create if not exists
     * @param productId 
     * @param variant 
     * @returns 
     */
    async addVariant(productId: number, variant: Variant) {
        // check if variant exists
        const exists = await this.model.getVariantByTitle(variant.title);
        if (exists) return exists;
        const result = await this.model.createVariant(productId, variant);
        return result;
    }
    /**
     * Read a variant
     * @param productId 
     * @param variantId 
     * @returns 
     */
    async readVariant(productId: number | null, variantId?: number) {
        if (productId && variantId) {
            const result = await this.model.getVariant(productId, variantId);
            return result;
        }
        if (variantId) {
            const result = await this.model.getVariantById(variantId);
            return result;
        }
    }
    /**
     * Read all variants of a product
     * @param productId 
     * @returns 
     */
    async readProductVariants(productId: number) {
        if (productId) {
            const result = await this.model.getProductVariants(productId);
            return {status: 'ok', data: result};
        }
        return {status: 'fail', data: null, message: 'Product ID is required.'};
    }
}