import { Category, CategoryAndProductType, CategoryCommonName, CategoryToCategory, CommonName, Product, ProductToCategory, ProductType, Status } from "@DB/sqlite/schema";
import { db } from "@DB/sqlite";
import { eq, count, like, asc, desc, and } from "drizzle-orm";

export class CategoryModel {
	async selectCategories() {
		const categories = await db.select({ id: Category.id, name: Category.name }).from(Category).where(eq(Category.active, true));
		return categories;
	}

	async getById(id: number) {
		const exists = await db.select().from(Category).where(eq(Category.id, id)).get();
		if (exists) {
			const products = await db.select({
				status: Status.name,
				count: count(ProductToCategory.productId)
			})
				.from(ProductToCategory)
				.leftJoin(Product, eq(ProductToCategory.productId, Product.id))
				.leftJoin(Status, eq(Product.statusId, Status.id))
				.where(eq(ProductToCategory.categoryId, id))
				.groupBy(Status.name);
			const commonNames = await db.select({
				id: CommonName.id,
				commonName: CommonName.name
			})
				.from(CategoryCommonName)
				.leftJoin(CommonName, eq(CategoryCommonName.commonNameId, CommonName.id))
				.where(eq(CategoryCommonName.categoryId, id));
			const productTypes = await db.select({
				id: ProductType.id,
				name: ProductType.name
			})
				.from(CategoryAndProductType)
				.leftJoin(ProductType, eq(CategoryAndProductType.productTypeId, ProductType.id))
				.where(eq(CategoryAndProductType.categoryId, id));
			return {
				...exists,
				products: products,
				commonNames: commonNames,
				productTypes: productTypes,
				parents: await this.getParents(id)
			};
		}
		return null;
	}

	async getAll(terms: string | null, page: number, limit: number, active: boolean, sorting: string) {
		// page = 1; limit = 10 then offset = 0 when page > 1 then offset = (page - 1) * limit
		const offset = page > 1 ? (page - 1) * limit : 0;
		console.log("Model request", terms, page, limit, active, sorting);
		const listWithNoParents = [];
		// When are terms
		if (terms) {
			// When we want just active
			if (active) {
				// when is descending order
				if (sorting !== 'asc') {
					const list = await db.select({
						id: Category.id,
						name: Category.name,
						slug: Category.slug,
						description: Category.description,
						active: Category.active,
						storeId: Category.storeId,
						storeName: Category.storeName,
						handle: Category.handle,
						descriptionAllowed: Category.descriptionAllowed,
						collectionAllowed: Category.collectionAllowed
					})
						.from(Category)
						.where(
							and(
								eq(Category.active, true),
								like(Category.name, `%${terms}%`)
							))
						.limit(limit)
						.offset(offset)
						.orderBy(desc(Category.name));
					if (list.length > 0) listWithNoParents.push(...list);
				} else {
					// When is ascending order
					const list = await db.select({
						id: Category.id,
						name: Category.name,
						slug: Category.slug,
						description: Category.description,
						active: Category.active,
						storeId: Category.storeId,
						storeName: Category.storeName,
						handle: Category.handle,
						descriptionAllowed: Category.descriptionAllowed,
						collectionAllowed: Category.collectionAllowed
					})
						.from(Category)
						.where(
							and(
								eq(Category.active, true),
								like(Category.name, `%${terms}%`)
							))
						.limit(limit)
						.offset(offset)
						.orderBy(asc(Category.name));
					if (list.length > 0) listWithNoParents.push(...list);
				}
			} else {
				// When is descending order
				if (sorting !== 'asc') {
					const list = await db.select({
						id: Category.id,
						name: Category.name,
						slug: Category.slug,
						description: Category.description,
						active: Category.active,
						storeId: Category.storeId,
						storeName: Category.storeName,
						handle: Category.handle,
						descriptionAllowed: Category.descriptionAllowed,
						collectionAllowed: Category.collectionAllowed
					})
						.from(Category)
						.where(
							and(
								like(Category.name, `%${terms}%`)
							))
						.limit(limit)
						.offset(offset)
						.orderBy(desc(Category.name));
					if (list.length > 0) listWithNoParents.push(...list);
				} else {
					// when is ascending order
					const list = await db.select({
						id: Category.id,
						name: Category.name,
						slug: Category.slug,
						description: Category.description,
						active: Category.active,
						storeId: Category.storeId,
						storeName: Category.storeName,
						handle: Category.handle,
						descriptionAllowed: Category.descriptionAllowed,
						collectionAllowed: Category.collectionAllowed
					})
						.from(Category)
						.where(
							and(
								like(Category.name, `%${terms}%`)
							))
						.limit(limit)
						.offset(offset)
						.orderBy(asc(Category.name));
					if (list.length > 0) listWithNoParents.push(...list);
				}
			}
		} else {
			// When are not terms and want only active ones
			if (active) {
				// Descending order
				if (sorting !== 'asc') {
					const list = await db.select({
						id: Category.id,
						name: Category.name,
						slug: Category.slug,
						description: Category.description,
						active: Category.active,
						storeId: Category.storeId,
						storeName: Category.storeName,
						handle: Category.handle,
						descriptionAllowed: Category.descriptionAllowed,
						collectionAllowed: Category.collectionAllowed
					})
						.from(Category)
						.where(
							and(
								eq(Category.active, true),
							))
						.limit(limit)
						.offset(offset)
						.orderBy(desc(Category.name));
					if (list.length > 0) listWithNoParents.push(...list);
				} else {
					// ascending order
					const list = await db.select({
						id: Category.id,
						name: Category.name,
						slug: Category.slug,
						description: Category.description,
						active: Category.active,
						storeId: Category.storeId,
						storeName: Category.storeName,
						handle: Category.handle,
						descriptionAllowed: Category.descriptionAllowed,
						collectionAllowed: Category.collectionAllowed
					})
						.from(Category)
						.where(
							and(
								eq(Category.active, true),
							))
						.limit(limit)
						.offset(offset)
						.orderBy(asc(Category.name));
					if (list.length > 0) listWithNoParents.push(...list);
				}
			} else {
				// When are not terms and we ant all data in descending order
				if (sorting !== 'asc') {
					const list = await db.select({
						id: Category.id,
						name: Category.name,
						slug: Category.slug,
						description: Category.description,
						active: Category.active,
						storeId: Category.storeId,
						storeName: Category.storeName,
						handle: Category.handle,
						descriptionAllowed: Category.descriptionAllowed,
						collectionAllowed: Category.collectionAllowed
					})
						.from(Category)
						.limit(limit)
						.offset(offset)
						.orderBy(desc(Category.name));
					if (list.length > 0) listWithNoParents.push(...list);
				} else {
					// ascending order
					const list = await db.select({
						id: Category.id,
						name: Category.name,
						slug: Category.slug,
						description: Category.description,
						active: Category.active,
						storeId: Category.storeId,
						storeName: Category.storeName,
						handle: Category.handle,
						descriptionAllowed: Category.descriptionAllowed,
						collectionAllowed: Category.collectionAllowed
					})
						.from(Category)
						.limit(limit)
						.offset(offset)
						.orderBy(asc(Category.name));
					if (list.length > 0) listWithNoParents.push(...list);
				}
			}
		}
		console.log("listWithNoParents", listWithNoParents);
		if (listWithNoParents.length > 0) {
			const listWithParents = await Promise.all(listWithNoParents.map(async (item) => {
				const parents = await this.getParents(item.id);
				return {
					...item,
					parents: parents
				}
			}));
			return listWithParents;
		} else {
			return listWithNoParents;
		}
	}

	async getCount(terms: string | null, active: boolean) {
		let total;
		if (terms) {
			if (active) {
				total = await db.select({ count: count(Category.id) })
					.from(Category)
					.where(
						and(
							eq(Category.active, true),
							like(Category.name, `%${terms}%`)
						)
					).get();
			}
			total = await db.select({ count: count(Category.id) })
				.from(Category)
				.where(
					and(
						like(Category.name, `%${terms}%`)
					)
				).get();
		}
		if (active) {
			total = await db.select({ count: count(Category.id) })
				.from(Category)
				.where(
					and(
						eq(Category.active, true)
					)
				).get();
		}
		total = await db.select({ count: count(Category.id) }).from(Category).get();
		return total ? total.count : 0;
	}

	async add(category: {
		name: string;
		parent: number | null;
		slug: string;
	}) {
		const exists = await db
			.select()
			.from(Category)
			.where(eq(Category.name, category.name)).get();
		if (exists) return exists;
		const newCategory = await db.insert(Category).values({
			name: category.name,
			slug: category.slug,
			active: true
		}).returning();
		if (category.parent) {
			// save relationship
			await db.insert(CategoryToCategory).values({
				childId: newCategory[0].id,
				parentId: Number(category.parent)
			}).returning();
		}
		// get parent
		const parents = await this.getParents(newCategory[0].id);
		return {
			...newCategory[0],
			parents: parents
		};
	}

	async create(data: {
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
		const exists = await db
			.select()
			.from(Category)
			.where(eq(Category.name, data.name)).get();
		if (exists) {
			const parents = await this.getParents(exists.id);
			return {
				...exists,
				parents: parents
			};
		}
		const newCategory = await db.insert(Category).values({
			name: data.name,
			slug: data.slug,
			description: data.description,
			active: data.active,
			descriptionAllowed: data.allow.description,
			collectionAllowed: data.allow.collection
		}).returning();
		// save relationship
		data.parents?.forEach(async (parent) => {
			await db.insert(CategoryToCategory).values({
				childId: newCategory[0].id,
				parentId: Number(parent)
			}).returning();
		});
		// get parent
		const parents = await this.getParents(newCategory[0].id);
		return {
			...newCategory[0],
			parents: parents
		};
	}

	async update(id: number, category: {
		name: string;
		parents: number[] | null;
		slug: string;
		active: boolean;
	}) {
		const res = await db.update(Category).set({
			name: category.name as string,
			slug: category.slug,
			active: category.active
		}).where(eq(Category.id, id)).returning();
		if (res.length > 0) {
			// save relationship
			category.parents?.forEach(async (parent) => {
				await db.insert(CategoryToCategory).values({
					childId: res[0].id,
					parentId: Number(parent)
				}).returning();
			});
			// get parent
			const parents = await this.getParents(res[0].id);
			return {
				...res[0],
				parents: parents
			};
		}
		return null;
	}

	async delete(id: number) {
		return await db.delete(Category).where(eq(Category.id, id)).returning();
	}

	async getParents(child: number) {
		return await db.select({
			id: CategoryToCategory.parentId,
			name: Category.name
		}).from(CategoryToCategory)
			.leftJoin(Category, eq(CategoryToCategory.parentId, Category.id))
			.where(eq(CategoryToCategory.childId, child));
	}

	async search(terms: string | null) {
		if (terms) {
			return await db.select({
				id: Category.id,
				name: Category.name,
				slug: Category.slug,
				description: Category.description,
				active: Category.active,
				storeId: Category.storeId,
				storeName: Category.storeName,
				handle: Category.handle,
				descriptionAllowed: Category.descriptionAllowed,
				collectionAllowed: Category.collectionAllowed
			})
				.from(Category)
				.where(
					and(
						like(Category.name, `%${terms}%`)
					))
				.limit(10)
				.offset(0);
		}
		return await db.select({
			id: Category.id,
			name: Category.name,
			slug: Category.slug,
			description: Category.description,
			active: Category.active,
			storeId: Category.storeId,
			storeName: Category.storeName,
			handle: Category.handle,
			descriptionAllowed: Category.descriptionAllowed,
			collectionAllowed: Category.collectionAllowed
		})
			.from(Category)
			.limit(10)
			.offset(0);
	}
}
