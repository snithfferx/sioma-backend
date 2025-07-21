import { db } from "@DB/sqlite";
import { Offer } from "@DB/sqlite/schema";
import { asc, desc, eq, like } from "drizzle-orm";

export class OfferModel {
    async create(data: {
        type: number;
        title: string;
        brand: string;
        category: string;
        collection: string;
        parent: number;
        startDate: Date;
        endDate: Date;
        closeDate: Date;
        status: number;
        images: string[];
    }) {
        // Offer exists
        const exists = await db.select().from(Offer).where(eq(Offer.title, data.title)).get();
        if (exists) {
            return { success: false, message: 'Oferta ya existe' };
        }
        // Create offer
        const offer = await db.insert(Offer).values({
            type: data.type,
            title: data.title,
            brand: data.brand,
            category: data.category,
            collection: data.collection,
            parent: data.parent,
            startDate: data.startDate.getTime(),
            endDate: data.endDate.getTime(),
            closeDate: data.closeDate.getTime(),
            status: data.status || 1,
            images: data.images.join(',')
        }).returning();
        return { success: true, message: 'Oferta creada correctamente', offer: offer };
    }

    async getAll(terms: string | null, page: number = 1, limit: number = 10, sorting: string = 'asc', status: number = 1) {
        const offset = (page - 1) * limit;
        const query = db.select().from(Offer);
        if (status) {
            query.where(eq(Offer.status, status));
        }
        if (terms) {
            query.where(like(Offer.title, `%${terms}%`));
        }
        if (sorting === 'asc') {
            query.orderBy(asc(Offer.title));
        } else {
            query.orderBy(desc(Offer.title));
        }
        const offers = await query.limit(limit).offset(offset);
        return offers;
    }

    async getCount(terms: string | null, status: number = 1) {
        const query = db.select({count: count(Offer.id)}).from(Offer).where(eq(Offer.status, status));
        if (terms) {
            query.where(like(Offer.title, `%${terms}%`));
        }
        const count = await query.count();
        return count;
    }
}