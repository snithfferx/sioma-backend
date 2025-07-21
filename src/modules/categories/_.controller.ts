import { CategoryModel } from "@Modules/categories/Category.model";

export class CategoriesController {
    model = new CategoryModel();
    constructor() { }
    async selectFillCategories() {
        return await this.model.selectCategories();
    }

    async createCategory(data: {
        name: string;
        slug: string;
        description: string | null;
        parents: number[] | null;
        active: boolean;
        allow: {
            description: boolean;
            collection: boolean;
        }
    }) {
        if (!data.name) {
            return { status: 'fail', data: null, message: 'Name is required.' };
        }
        const category = await this.model.create({
            name: data.name || 'NC',
            parents: data.parents || null,
            slug: data.slug || 'n-c',
            description: data.description || null,
            active: data.active ?? true,
            allow: data.allow
        });
        if (category) {
            return { status: 'ok', data: { id: category.id, name: data.name }, message: "Category created successfully" };
        } else {
            return { status: 'fail', data: null, message: "Category already exists" };
        }
    }

    async getAllCategories(terms: string | null, page: number = 1, limit: number = 10, active: boolean = false, sorting: string = 'asc') {
        const result = await this.model.getAll(terms, page, limit, active, sorting);
        console.log("result", result);
        const total = await this.model.getCount(terms, active);
        const totalPages = Math.ceil(total / limit);
        return {
            status: 'ok', data: {
                results: result,
                total: total,
                pagination: {
                    current: page,
                    total: totalPages,
                    perPage: limit,
                },
                terms: {
                    includeActive: active,
                    sort: sorting
                }
            }, message: null
        };
    }

    async categoryFilter() {
        return await this.model.getAll(null, 1, 10, false, 'asc');
    }

    async addCategory(category: { name: string | null; parent?: number; slug?: string; }) {
        const res = await this.model.add({
            name: category.name || 'NC',
            parent: category.parent || null,
            slug: category.slug || 'n-c'
        });
        if (res) {
            return { status: 'ok', data: res, message: 'Category added successfuly!' };
        }
        return { status: 'fail', data: null, message: 'Category not added!' };
    }

    async updateCategory(id: number, category: { name: string; parents: number[] | null; slug: string; active: boolean; }) {
        const res = await this.model.update(id, category);
        if (res) {
            return { status: 'ok', data: res, message: 'Category updated successfuly!' };
        }
        return { status: 'fail', data: null, message: 'Category: ' + id + ', not updated.' };
    }

    async getCategoryById(id: number) {
        const res = await this.model.getById(id);
        return {
            status: res ? 'ok' : 'fail',
            data: res,
            message: res ? null : 'Category found'
        };
    }

    async deleteCategory(id: number) {
        const res = await this.model.delete(id);
        return {
            status: res ? 'ok' : 'fail',
            data: res,
            message: res ? null : 'Category found'
        };
    }

    async searchCategories(terms: string | null) {
        const res = await this.model.search(terms);
        return {
            status: res ? 'ok' : 'fail',
            data: res,
            message: res ? null : 'Category found'
        };
    }
}
