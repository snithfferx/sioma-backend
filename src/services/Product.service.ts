import { ProductController } from "@Modules/products/Product.controller";

const productController = new ProductController();

export class ProductService {
    async getAllProducts(terms: string | null, page: number = 1, limit: number = 10) {
        const list = await productController.getAllProducts(terms, page, limit);
        // const list = await db.select().from(Products).limit(limit).offset((page - 1) * limit);
        if (!list) {
            return Error("Product not found");
        }
        return list;
    }
    async createProduct(data: any, user: number) {
        return "Product created";
    }

    async getMigrationData(page: number) {
        return [];
    }

    async getProductByTerms(terms: string) {
        return [];
    }

    async getProductById(id: number) {
        return [];
    }

    async updateProduct(id: number, data: any) {
        return [];
    }
}