import { calcPrice } from "@App/utils/products/functions";
import { db } from "@DB/sqlite";
import { Taxes, Price } from "@DB/sqlite/schema";
import { eq } from "drizzle-orm";

export class PriceModel {
    private vat = 0;
    private rent = 0;
    private margin = 0.5;
    
    constructor() { this.getTaxes(); }

    async create (variant:number,data: {
        cost:number;
        added:number;
        discount:number;
        increase:number;
        category:number;
        offer:number;
        asignedBy:string;
        margin?:number;
        regularPrice?:number;
    }) {
        const exists = await db.select().from(Price).where(eq(Price.variantId, variant)).get();
        if (exists) {
            return await this.update(exists.variantId, data);
        }
        const {cost,added,discount,increase,category,offer,asignedBy,regularPrice} = data;
        const regular = regularPrice ?? calcPrice(cost,added,this.vat,this.rent,this.margin);
        const offerPrice = offer > 0 ? regular * (offer / 100) : 0;
        const res = await db.insert(Price).values({
            variantId: variant,
            cost: cost,
            added: added,
            disccount: discount,
            increase: increase,
            category: category,
            regularPrice: regular,
            onlinePrice: regular,
            offerPrice: offerPrice,
            asignedBy: asignedBy,
            margin: data.margin ?? this.margin
        }).returning();
        return res[0];
    }

    async update(id: number, data: {
        cost?:number;
        added?:number;
        disccount?:number;
        increase?:number;
        category?:number;
        offer?:number;
        asignedBy?:string;
        margin?:number;
        regularPrice?:number;
    }) {
        const price = await db.select().from(Price).where(eq(Price.id, id)).get();
        if (!price) {
            return null;
        }
        const regular = data.regularPrice ?? price.regularPrice;
        const offer = data.offer ?? price.offerPrice;
        const offerPrice = offer > 0 ? regular * (offer / 100) : 0;
        const res = await db.update(Price).set({
            cost: data.cost,
            added: data.added,
            disccount: data.disccount,
            increase: data.increase,
            category: data.category,
            regularPrice: regular,
            onlinePrice: regular,
            offerPrice: offerPrice,
            asignedBy: data.asignedBy,
            margin: data.margin ?? price.margin
        }).where(eq(Price.id, id)).returning();
        return res[0];
    }

    async delete (id: number) {
        const price = await db.select().from(Price).where(eq(Price.id, id)).get();
        if (!price) {
            return null;
        }
        return await db.delete(Price).where(eq(Price.id, id)).returning();
    }

    async getTaxes() {
        const vatRes = await db.select({val: Taxes.value}).from(Taxes).where(eq(Taxes.name,'IVA')).get();
        this.vat = vatRes?.val ?? 0;
        const rentRes = await db.select({val: Taxes.value}).from(Taxes).where(eq(Taxes.name,'Rent')).get();
        this.rent = rentRes?.val ?? 0;
        const marginRes = await db.select({val: Taxes.value}).from(Taxes).where(eq(Taxes.name,'Margin')).get();
        this.margin = marginRes?.val ?? 0;
    }

    async getAll() {
        return await db.select().from(Price);
    }

    async getAllByVariant(variant: number) {
        return await db.select({
            id: Price.id,
            disccount: Price.disccount,
            increase: Price.increase,
            category: Price.category,
            regularPrice: Price.regularPrice,
            onlinePrice: Price.onlinePrice,
            offerPrice: Price.offerPrice,
            asignedBy: Price.asignedBy,
            updatedAt: Price.updatedAt
        }).from(Price).where(eq(Price.variantId, variant));
    }

    async getById(id: number) {
        return await db.select().from(Price).where(eq(Price.id, id)).get();
    }
}