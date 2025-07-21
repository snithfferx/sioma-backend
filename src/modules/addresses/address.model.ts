import { Address, ContactAddress, Person, Contact, PersonAddress } from "@DB/sqlite/schema";
import { db } from "@DB/sqlite";
import type { AddressType } from "@Types/schemas/address";
import { and, asc, desc, eq, like, or } from "drizzle-orm";

export class AddressModel {
    async create(data:AddressType) {
        if (data) {
            if (!data.name) {
                throw new Error("Name is required.");
            }
            const result = await db.insert(Address).values(data).returning();
            return result ? result[0] : null;
        }
        return null;
    }

    async update(id:string,data:Partial<AddressType>) {
        // Check if id exists
        const exists = await this.getById(id);
        if (!exists) return null;
        if (!data) return null;
        // loop data and filter null or undefined
        const newData = Object.fromEntries(
            Object.entries(data).filter(([index,value]) => value !== null)
        );
        const result = await db.update(Address).set(newData).where(eq(Address.id, parseInt(id))).returning();
        return result ? result[0] : null;
    }

    async getById(id:string) {
        return await db.select().from(Address)
            .leftJoin(ContactAddress, eq(Address.id, ContactAddress.addressId))
            .leftJoin(PersonAddress, eq(Address.id, PersonAddress.addressId))
            .leftJoin(Contact, eq(Contact.id, ContactAddress.contactId))
            .leftJoin(Person, eq(Person.id, PersonAddress.personId))
            .where(eq(Address.id, parseInt(id))).get();
    }

    async getAll(terms:string|null,page:number,limit:number,sort:string) {
        const offset = page > 1 ? (page - 1) * limit : 0;
        if (terms) {
            if (sort !== 'asc') {
                return await db.select().from(Address)
                .leftJoin(ContactAddress, eq(Address.id, ContactAddress.addressId))
                .leftJoin(PersonAddress, eq(Address.id, PersonAddress.addressId))
                .leftJoin(Contact, eq(Contact.id, ContactAddress.contactId))
                .leftJoin(Person, eq(Person.id, PersonAddress.personId))
                .where(or(like(Address.name, `%${terms}%`), like(Contact.name, `%${terms}%`), like(Person.firstName, `%${terms}%`)))
                .limit(limit).offset(offset).orderBy(desc(Address.name));
            }
            return await db.select().from(Address)
            .leftJoin(ContactAddress, eq(Address.id, ContactAddress.addressId))
            .leftJoin(PersonAddress, eq(Address.id, PersonAddress.addressId))
            .leftJoin(Contact, eq(Contact.id, ContactAddress.contactId))
            .leftJoin(Person, eq(Person.id, PersonAddress.personId))
            .where(or(like(Address.name, `%${terms}%`), like(Contact.name, `%${terms}%`), like(Person.firstName, `%${terms}%`)))
            .limit(limit).offset(offset).orderBy(asc(Address.name));
        } else {
            if (sort !== 'asc') {
                return await db.select().from(Address)
                .leftJoin(ContactAddress, eq(Address.id, ContactAddress.addressId))
                .leftJoin(PersonAddress, eq(Address.id, PersonAddress.addressId))
                .leftJoin(Contact, eq(Contact.id, ContactAddress.contactId))
                .leftJoin(Person, eq(Person.id, PersonAddress.personId))
                .limit(limit).offset(offset).orderBy(desc(Address.name));
            }
            return await db.select().from(Address)
            .leftJoin(ContactAddress, eq(Address.id, ContactAddress.addressId))
            .leftJoin(PersonAddress, eq(Address.id, PersonAddress.addressId))
            .leftJoin(Contact, eq(Contact.id, ContactAddress.contactId))
            .leftJoin(Person, eq(Person.id, PersonAddress.personId))
            .limit(limit).offset(offset).orderBy(asc(Address.name));
        }
    }

    async getCount(terms:string|null) {
        if (terms) {
            return await db.select().from(Address)
            .leftJoin(ContactAddress, eq(Address.id, ContactAddress.addressId))
            .leftJoin(PersonAddress, eq(Address.id, PersonAddress.addressId))
            .leftJoin(Contact, eq(Contact.id, ContactAddress.contactId))
            .leftJoin(Person, eq(Person.id, PersonAddress.personId))
            .where(or(like(Address.name, `%${terms}%`), like(Contact.name, `%${terms}%`), like(Person.firstName, `%${terms}%`))).get();
        }
        return await db.select().from(Address).get();
    }

    async delete(id:string) {
        return await db.delete(Address).where(eq(Address.id, parseInt(id))).returning();
    }

    async getFill(who:string,id:number) {
        if (who === 'contact') {
            return await db.select({id:Address.id,name:Address.name,}).from(Address).leftJoin(ContactAddress,eq(Address.id,ContactAddress.addressId)).where(eq(ContactAddress.contactId,id)).orderBy(desc(Address.name));
        }
        if (who === 'person') {
            return await db.select({id:Address.id,name:Address.name,}).from(Address).leftJoin(PersonAddress,eq(Address.id,PersonAddress.addressId)).where(eq(PersonAddress.personId,id)).orderBy(desc(Address.name));
        }
        return null;
    }

    async associate(who:string,id:number,addressId:number) {
        if (who === 'contact') {
            return await db.insert(ContactAddress).values({contactId:id,addressId:addressId}).returning();
        }
        if (who === 'person') {
            return await db.insert(PersonAddress).values({personId:id,addressId:addressId}).returning();
        }
        return null;
    }

    async disassociate(who:string,id:number,addressId:number) {
        if (who === 'contact') {
            return await db.delete(ContactAddress).where(and(eq(ContactAddress.contactId,id),eq(ContactAddress.addressId,addressId))).returning();
        }
        if (who === 'person') {
            return await db.delete(PersonAddress).where(and(eq(PersonAddress.personId,id),eq(PersonAddress.addressId,addressId))).returning();
        }
        return null;
    }
}
