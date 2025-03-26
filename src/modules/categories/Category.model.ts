import { db } from "@DB/sqlite";
import { eq, count } from "drizzle-orm";
import { Categories } from "@DB/sqlite/schema";

export class CategoryModel {
    async getAllCategories() {
        const list = await db
            .select({
                category: Categories,
            })
            .from(Categories)
            .limit(100);
        // count records
        const total = await this.getCategoriesCount();
        // const product = products;
        if (!list) {
            return Error("Category not found");
        }
        // Total pages
        const totalPages = Math.ceil(total[0].count / 100);
        return {
            data: list,
            current: 1,
            limit: 100,
            total: totalPages
        }
    }

    async getCategoriesCount() {
        return await db.select({ count: count(Categories.id) }).from(Categories);
    }

    async saveCategory(category: any) {
        const exists = await db
            .select()
            .from(Categories)
            .where(eq(Categories.name, category.name as string));
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
}