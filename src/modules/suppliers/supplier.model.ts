import { db } from "@DB/sqlite";
import { Supplier } from "@DB/sqlite/schema";
import { count,and, eq, like } from "drizzle-orm";

export class SupplierModel {
    async getAll(terms:string|null,page:number,limit:number,sort:string,active:boolean) {
        if (terms) {
            return await db.select({
                id: Supplier.id,
                name: Supplier.name,
                active: Supplier.active
            }).from(Supplier).where(and(like(Supplier.name, `%${terms}%`),eq(Supplier.active, active)));
        }
        return await db.select({
            id: Supplier.id,
            name: Supplier.name,
            active: Supplier.active
        }).from(Supplier).where(eq(Supplier.active, active));
    }
    async getCount(terms:string|null,active:boolean) {
        let total = 0;
        if (terms) {
            const res = await db.select({count: count(Supplier.id)}).from(Supplier).where(and(like(Supplier.name, `%${terms}%`),eq(Supplier.active, active)));
            total = res[0].count;
        }
        const res = await db.select({count: count(Supplier.id)}).from(Supplier).where(eq(Supplier.active, active));
        total = res[0].count;
        return total;
    }
    async get(id:number) {
        const supplier = await db.select().from(Supplier).where(eq(Supplier.id, id)).get();
        if (!supplier) return null;
        return supplier;
    }
    async update(id:number,data:{
        name:string;
    }) {
        return await db.update(Supplier).set(data).where(eq(Supplier.id, id));
    }
    async delete(id:number) {
        return await db.delete(Supplier).where(eq(Supplier.id, id));
    }
    async create(data:{
        name:string;
    }) {
        return await db.insert(Supplier).values({
            name: data.name,
            active: true
        }).returning();
    }

    async getSelectFill() {
        return await db.select({
            id: Supplier.id,
            name: Supplier.name
        }).from(Supplier);
    }
}
