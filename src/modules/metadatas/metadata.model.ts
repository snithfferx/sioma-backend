import { Metadata } from "@DB/sqlite/schema";
import { db } from "@DB/sqlite";
import { eq, count, like, asc, desc, and } from "drizzle-orm";
import type {Metadata as MetadataSchema} from "@Types/schemas/metadata.ts";

export class MetadataModel {
	async getAll(terms: string | null, page: number, limit: number, active: boolean, sorting: string) {
		const offset = page > 1 ? page * limit - 1 : 1;
		let list = [];
		if (terms) {
			if (active) {
				if (sorting !== 'asc') {
					list = await db.select()
						.from(Metadata)
						.where(
							and(
								eq(Metadata.active, true),
								like(Metadata.name, `%${terms}%`)
							)
						)
						.limit(limit)
						.offset(offset)
						.orderBy(desc(Metadata.name));
				}
				list = await db.select()
					.from(Metadata)
					.where(
						and(
							eq(Metadata.active, true),
							like(Metadata.name, `%${terms}%`)
						)
					)
					.limit(limit)
					.offset(offset)
					.orderBy(asc(Metadata.name));
			}
			if (sorting !== 'asc') {
				list = await db.select()
					.from(Metadata)
					.where(
						like(Metadata.name, `%${terms}%`)
					)
					.limit(limit)
					.offset(offset)
					.orderBy(desc(Metadata.name));
			}
			list = await db.select()
				.from(Metadata)
				.where(
					like(Metadata.name, `%${terms}%`)
				)
				.limit(limit)
				.offset(offset)
				.orderBy(asc(Metadata.name));
		}
		if (active) {
			if (sorting !== 'asc') {
				list = await db.select()
					.from(Metadata)
					.where(eq(Metadata.active, true))
					.limit(limit)
					.offset(offset)
					.orderBy(desc(Metadata.name));
			}
			list = await db.select()
				.from(Metadata)
				.where(eq(Metadata.active, true))
				.limit(limit)
				.offset(offset)
				.orderBy(asc(Metadata.name));
		}
		if (sorting !== 'asc') {
			list = await db.select()
				.from(Metadata)
				.limit(limit)
				.offset(offset)
				.orderBy(desc(Metadata.name));
		}
		list = await db.select()
			.from(Metadata)
			.limit(limit)
			.offset(offset)
			.orderBy(asc(Metadata.name));
		return list
	}
	
	async getById(id: number) {
		const result = await db.select().from(Metadata).where(eq(Metadata.id, id)).get();
		return result ?? null;
	}
	
	async create(data: MetadataSchema) {
		const result = await db.insert(Metadata).values({
			name: data.name,
			active: data.active,
			position: data.position,
			descriptionAllowed: data.descriptionAllowed,
			collectionAllowed: data.collectionAllowed,
			seoAllowed: data.seoAllowed,
			isFeature: data.isFeature,
			format: data.format,
			tooltip: data.tooltip
		}).get();
		return result ?? null;
	}
	
	async update(id: number, data: Partial<MetadataSchema>) {
		// loop through data and extract all not null values in new object
		const newData = Object.fromEntries(
			Object.entries(data).filter(([_, value]) => value !== null)
		);
		const result = await db.update(Metadata).set(newData).where(eq(Metadata.id, id)).get();
		return result ?? null;
	}
	
	async delete(id: number) {
		return await db.delete(Metadata).where(eq(Metadata.id, id)).get();
	}
	
	async getCount(terms: string | null, active: boolean) {
		if (terms) {
			if (active) {
				const res = await db.select({count: count(Metadata.id)}).from(Metadata).where(like(Metadata.name, `%${terms}%`)).get();
				return res ? res.count : 0;
			}
			const res = await db.select({count: count(Metadata.id)}).from(Metadata).where(like(Metadata.name, `%${terms}%`)).get();
			return res ? res.count : 0;
		}
		if (active) {
			const res = await db.select({count: count(Metadata.id)}).from(Metadata).where(eq(Metadata.active, true)).get();
			return res ? res.count : 0;
		}
		const res = await db.select({count: count(Metadata.id)}).from(Metadata).get();
		return res ? res.count : 0;
	}

	async selectFill() {
		const result = await db.select().from(Metadata).get();
		return result ?? null;
	}
}
