import { db } from "@DB/sqlite";
import { Metadata, MetadataValue } from "@DB/sqlite/schema";
import { eq,and,count,asc,desc, like } from "drizzle-orm";

export class MetadataValueModel {
    async create(metadata: number, data: {
        value: string;
        active: boolean;
    }) {
        const result = await db.insert(MetadataValue).values({
            metadataId: metadata,
            value: data.value,
            active: data.active,
            content: null
        }).returning();
        return result ? result[0] : null;
    }

    async getAll(terms: string | null, page: number, limit: number, active: boolean, sorting: string) {
        const offset = (page - 1) * limit;
        if (sorting !== 'asc') {
            if (active) {
                if (terms) {
                    const result = await db.select({
                        id: MetadataValue.id,
                        metadata: {
                            id: Metadata.id,
                            name: Metadata.name,
                        },
                        value: MetadataValue.value,
                        active: MetadataValue.active,
                        content: MetadataValue.content,
                        createdAt: MetadataValue.createdAt,
                        updatedAt: MetadataValue.updatedAt
                    })
                        .from(MetadataValue)
                        .leftJoin(Metadata, eq(MetadataValue.metadataId, Metadata.id))
                        .where(
                            and(
                                like(MetadataValue.value, `%${terms}%`),
                                eq(MetadataValue.active, active)
                            )
                    )
                    .limit(limit)
                    .offset(offset)
                        .orderBy(desc(MetadataValue.value));
                    return result;
                }
                const result = await db.select({
                    id: MetadataValue.id,
                    metadata: {
                        id: Metadata.id,
                        name: Metadata.name,
                    },
                    value: MetadataValue.value,
                    active: MetadataValue.active,
                    content: MetadataValue.content,
                    createdAt: MetadataValue.createdAt,
                    updatedAt: MetadataValue.updatedAt
                })
                .from(MetadataValue)
                .leftJoin(Metadata, eq(MetadataValue.metadataId, Metadata.id))
                .where(
                    eq(MetadataValue.active, active)
                )
                .limit(limit)
                .offset(offset)
                .orderBy(desc(MetadataValue.value));
                return result;
            }
            if (terms) {
                const result = await db.select({
                    id: MetadataValue.id,
                    metadata: {
                        id: Metadata.id,
                        name: Metadata.name,
                    },
                    value: MetadataValue.value,
                    active: MetadataValue.active,
                    content: MetadataValue.content,
                    createdAt: MetadataValue.createdAt,
                    updatedAt: MetadataValue.updatedAt
                })
                    .from(MetadataValue)
                    .leftJoin(Metadata, eq(MetadataValue.metadataId, Metadata.id))
                    .where(
                        like(MetadataValue.value, `%${terms}%`),
                    )
                    .limit(limit)
                    .offset(offset)
                    .orderBy(desc(MetadataValue.value));
                return result;
            }
            const result = await db.select({
                id: MetadataValue.id,
                metadata: {
                    id: Metadata.id,
                    name: Metadata.name,
                },
                value: MetadataValue.value,
                active: MetadataValue.active,
                content: MetadataValue.content,
                createdAt: MetadataValue.createdAt,
                updatedAt: MetadataValue.updatedAt
            })
                .from(MetadataValue)
                .leftJoin(Metadata, eq(MetadataValue.metadataId, Metadata.id))
                .limit(limit)
                .offset(offset)
                .orderBy(desc(MetadataValue.value));
            return result;
        }
        if (active) {
            if (terms) {
                const result = await db.select({
                    id: MetadataValue.id,
                    metadata: {
                        id: Metadata.id,
                        name: Metadata.name,
                    },
                    value: MetadataValue.value,
                    active: MetadataValue.active,
                    content: MetadataValue.content,
                    createdAt: MetadataValue.createdAt,
                    updatedAt: MetadataValue.updatedAt
                })
                    .from(MetadataValue)
                    .leftJoin(Metadata, eq(MetadataValue.metadataId, Metadata.id))
                    .where(
                        and(
                            like(MetadataValue.value, `%${terms}%`),
                            eq(MetadataValue.active, active)
                        )
                    )
                    .limit(limit)
                    .offset(offset)
                    .orderBy(asc(MetadataValue.value));
                return result;
            }
            const result = await db.select({
                id: MetadataValue.id,
                metadata: {
                    id: Metadata.id,
                    name: Metadata.name,
                },
                value: MetadataValue.value,
                active: MetadataValue.active,
                content: MetadataValue.content,
                createdAt: MetadataValue.createdAt,
                updatedAt: MetadataValue.updatedAt
            })
                .from(MetadataValue)
                .leftJoin(Metadata, eq(MetadataValue.metadataId, Metadata.id))
                .where(
                    eq(MetadataValue.active, active)
                )
                .limit(limit)
                .offset(offset)
                .orderBy(asc(MetadataValue.value));
            return result;
        }
        if (terms) {
            const result = await db.select({
                id: MetadataValue.id,
                metadata: {
                    id: Metadata.id,
                    name: Metadata.name,
                },
                value: MetadataValue.value,
                active: MetadataValue.active,
                content: MetadataValue.content,
                createdAt: MetadataValue.createdAt,
                updatedAt: MetadataValue.updatedAt
            })
                .from(MetadataValue)
                .leftJoin(Metadata, eq(MetadataValue.metadataId, Metadata.id))
                .where(
                    like(MetadataValue.value, `%${terms}%`),
                )
                .limit(limit)
                .offset(offset)
                .orderBy(asc(MetadataValue.value));
            return result;
        }
        const result = await db.select({
            id: MetadataValue.id,
            metadata: {
                id: Metadata.id,
                name: Metadata.name,
            },
            value: MetadataValue.value,
            active: MetadataValue.active,
            content: MetadataValue.content,
            createdAt: MetadataValue.createdAt,
            updatedAt: MetadataValue.updatedAt
        })
            .from(MetadataValue)
            .leftJoin(Metadata, eq(MetadataValue.metadataId, Metadata.id))
            .limit(limit)
            .offset(offset)
            .orderBy(asc(MetadataValue.value));
        return result;
    }

    async getCount(terms: string | null, active: boolean = false) {
        if (terms) {
            if (active) {
                const result = await db.select({ count: count(MetadataValue.id) })
                    .from(MetadataValue)
                    .where(
                        and(
                            like(MetadataValue.value, `%${terms}%`),
                            eq(MetadataValue.active, active)
                        )
                    )
                return result[0].count;
            }
            const result = await db.select({ count: count(MetadataValue.id) })
                .from(MetadataValue)
                .where(
                    like(MetadataValue.value, `%${terms}%`)
            )
            return result[0].count;
        }
        const result = await db.select({ count: count(MetadataValue.id) })
            .from(MetadataValue)
        return result[0].count;
    }

    async update(id: number, data: {
        value: string;
        active: boolean;
        content: string;
    }) {
        const result = await db.update(MetadataValue).set(data).where(eq(MetadataValue.metadataId, id)).returning();
        return result[0];
    }

    async delete(id: number) {
        const result = await db.delete(MetadataValue).where(eq(MetadataValue.id, id));
        return result;
    }

    async selectFill() {
        const result = await db.select({
            id: MetadataValue.id,
            Value: MetadataValue.value,
        }).from(MetadataValue);
        return result;
    }

    async getOne(id: number) {
        const result = await db.select({
            id: MetadataValue.id,
            metadata: {
                id: Metadata.id,
                name: Metadata.name,
            },
            value: MetadataValue.value,
            content: MetadataValue.content,
            active: MetadataValue.active,
            createdAt: MetadataValue.createdAt,
            updatedAt: MetadataValue.updatedAt
        })
            .from(MetadataValue)
            .leftJoin(Metadata, eq(MetadataValue.metadataId, Metadata.id))
            .where(eq(MetadataValue.id, id)).get();
        return result??null;
    }
}