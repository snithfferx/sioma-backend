import { CategoryModel } from "@Modules/categories/Category.model";

const model = new CategoryModel
export class CategoriesController {
    constructor() { }

    async getAllCategories(page: number = 1, limit: number = 100) {
        const list = await model.getAllCategories();
        if (!list) {
            return Error("Category not found");
        }
        return list;
    }
}