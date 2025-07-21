import { OfferModel } from "@Modules/offers/offer.model";

export class OffersController {
    private model = new OfferModel();

    async createOffer(data: {
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
        return this.model.create(data);
    }

    async getOffers(terms: string | null, page: number = 1, limit: number = 10, sorting: string = 'asc', status: number = 1) {
        const offers = await this.model.getAll(terms, page, limit, sorting, status);
        const total = await this.model.getCount(terms, status);
        const totalPages = Math.ceil(total / limit);
        return { success: true, data: offers, pagination: { page, limit, sorting, status, total, totalPages } };
    }
}