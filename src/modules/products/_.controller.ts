import type { Product, Variant } from "@Types/validators/product";
import { ProductModel } from "@Modules/products/product.model";
import { VariantsController } from "@Modules/variants/_.controller";

export class ProductsController {
    model = new ProductModel();
    variantController = new VariantsController();
    constructor() { }
    async create(data: { product: Product, variant: Variant }) {
        if (!data.product.name) {
            return { status: 'fail', data: null, message: 'Product name is required.' };
        }
        const product = await this.model.createProduct(data.product);
        if (product) {
            await this.variantController.addVariant(product.id, data.variant);
            return { status: 'ok', data: { id: product.id, name: data.product.name }, message: "Product created successful" };
        }
    }

    async readProduct(id: number) {
        const product = await this.model.getProductById(id);
        if (!product) {
            return { status: 'fail', data: null, message: 'Product not found.' };
        }
        const variant = await this.variantController.readProductVariants(id);
        return { status: 'ok', data: { ...product, variants: variant.data }, message: null };
    }

    async update(id: number, data: {
        product: Product
        variant: Variant
    }) {
        if (!data.product.name) {
            return { status: 'fail', data: null, message: 'Product name is required.' };
        }
        // const product = await this.model.updateProduct(id, data.product);
        // if (product) {
        //     const variant = await this.variantController.addVariant(id, data.variant);
        //     return { status: 'ok', data: { id: product.id, name: data.product.name }, message: "Product updated successful" };
        // }
    }

    async validateUPC(upc: string) {
        // if (upc.length !== 12) {
        //     return { status: 'fail', data: null, message: 'El UPC debe tener 12 dígitos.' };
        // }
        const product = await this.model.getProductByUPC(upc);
        if (product) {
            return { status: false, data: null, message: 'El UPC ya está en uso.' };
        }
        return { status: 'ok', data: null, message: 'UPC válido.' };
    }

    async validateMPN(mpn: string) {
        if (!mpn) {
            return { status: false, data: null, message: 'El MPN es requerido.' };
        }
        const product = await this.model.getProductByMPN(mpn);
        if (product) {
            return { status: false, data: null, message: 'El MPN ya está en uso.' };
        }
        return { status: 'ok', data: null, message: 'MPN válido.' };
    }

    async validateSKU(sku: string) {
        if (!sku) {
            return { status: false, data: null, message: 'El SKU es requerido.' };
        }
        const product = await this.model.getProductBySKU(sku);
        if (product) {
            return { status: false, data: null, message: 'El SKU ya está en uso.' };
        }
        return { status: 'ok', data: null, message: 'SKU válido.' };
    }

    async generate(type: string) {
        const date = new Date();
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        // const seconds = date.getSeconds().toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 10).toString().padStart(1, '0');
        const additional = Math.floor(Math.random() * 10).toString().padStart(1, '0');
        let identifier = '';

        switch (type) {
            case 'mpn': {
                identifier = `DS-${year}${month}${day}-${hours}${minutes}${random}${additional}`;
                const mpnExists = await this.model.productExists({ mpn: identifier });
                if (mpnExists) this.generate(type);
                break;
            }
            case 'sku': {
                identifier = `DS-${year}${month}${day}${random}-${additional}`;
                const skuExists = await this.model.productExists({ sku: identifier });
                if (skuExists) this.generate(type);
                break;
            }
            case 'upc': {
                identifier = `${year}${month}${day}${hours}${minutes}${random}`;
                if (identifier.length > 12) identifier = identifier.slice(0, 12);
                if (identifier.length < 12) identifier = identifier.padStart(12, additional);
                const upcExists = await this.model.productExists({ upc: identifier });
                if (upcExists) this.generate(type);
                break;
            }
            case 'ean': {
                identifier = `0${year}${month}${day}${hours}${random}${additional}`;
                if (identifier.length > 13) identifier = identifier.slice(0, 13);
                if (identifier.length < 13) identifier = identifier.padStart(13, additional);
                break;
            }
        }
        return {
            status: 'ok', data: identifier, message: 'Identifier generated successfully.'
        };
    }

    async getProducts(page: number, limit: number, terms: string | null, sort: string, outOfStock: boolean) {
        const products = await this.model.getAll(page, limit, terms, sort, outOfStock);
        // prices and discounts
        // Stocks
        const count = await this.model.getCount(terms, outOfStock);
        const max = Math.ceil(count / limit);
        return {
            status: 'ok',
            data: {
                result: products,
                total: count,
                pagination: {
                    limit: limit,
                    total: max,
                    current: page,
                },
                terms: {
                    includeActive: outOfStock,
                    sort: sort
                }
            }, message: null
        }
    }

    async getAdminProducts(page: number, limit: number, terms: string | null, sort: string, active: boolean, status: number | null) {
        const products = await this.model.getAdminList(terms, page, limit, sort, active, status);
        const count = await this.model.getAdminListCount(terms, active, status);
        const max = Math.ceil(count / limit);
        return {
            status: 'ok',
            data: {
                result: products,
                total: count,
                pagination: {
                    limit: limit,
                    total: max,
                    current: page,
                },
                terms: {
                    includeActive: active,
                    sort: sort
                }
            }, message: null
        }
    }
}
