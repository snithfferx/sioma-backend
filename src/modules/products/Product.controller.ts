import { ProductModel } from "@Modules/products/Product.model";

const model = new ProductModel
export class ProductController {
    constructor() { }

    async getAllProducts(terms: string | null, page: number, limit: number) {
        if (!terms) {
            return model.getAllProducts(page, limit);
        } else {
            return model.getProductsByTerms(terms, page, limit);
        }
    }
}