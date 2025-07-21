import { db } from "@DB/sqlite";
import { asc, desc, eq, like, or } from "drizzle-orm";
import { Company, Contact, CompanyContact, ContactAddress, Address } from "@DB/sqlite/schema";

export class CompanyModel {
    async create(data:{
            name:string,
            registerNumber:string|null,
            abbreviation:string,
            vatNumber:string|null,
            logo:string|null,
            phone:string|null,
            email:string|null
        }) {
            const exists = await db.select().from(Company).where(eq(Company.name, data.name)).get();
            if (exists) return exists;
            const result = await db.insert(Company).values(data).returning();
            return result ? result[0] : null;
    }

    async update(id:string,data:Partial<{
        name:string,
        registerNumber:string|null,
        abbreviation:string,
        vatNumber:string|null,
        logo:string|null,
        phone:string|null,
        email:string|null
    }>) {
        const exists = await db.select().from(Company).where(eq(Company.id, parseInt(id))).get();
        if (!exists) return null;
        if (!data) return null;
        const newData = Object.fromEntries(
            Object.entries(data).filter(([_, value]) => value !== null)
        );
        const result = await db.update(Company).set(newData).where(eq(Company.id, parseInt(id))).returning();
        return result ? result[0] : null;
    }

    async getById(id:string) {
        return await db.select().from(Company)
        .leftJoin(CompanyContact,eq(Company.id,CompanyContact.companyId))
            .leftJoin(Contact, eq(CompanyContact.contactId, Contact.id))
            .leftJoin(ContactAddress, eq(Contact.id, ContactAddress.contactId))
            .leftJoin(Address, eq(ContactAddress.addressId, Address.id))
            .where(eq(Company.id, parseInt(id))).get();
    }

    async getAll(terms:string|null,page:number,limit:number,sort:string) {
        const offset = page > 1 ? (page - 1) * limit : 0;
        if (terms) {
            if (sort == 'asc') {
                return await db.select().from(Company)
                .leftJoin(CompanyContact,eq(Company.id,CompanyContact.companyId))
                    .leftJoin(Contact, eq(CompanyContact.contactId, Contact.id))
                    .leftJoin(ContactAddress, eq(Contact.id, ContactAddress.contactId))
                    .leftJoin(Address, eq(ContactAddress.addressId, Address.id))
                    .where(or(
                        like(Company.name, `%${terms}%`),
                        like(Company.abbreviation, `%${terms}%`),
                        like(Company.vatNumber, `%${terms}%`)
                    ))
                    .limit(limit).offset(offset).orderBy(asc(Company.name));
            }
            return await db.select().from(Company)
            .leftJoin(CompanyContact,eq(Company.id,CompanyContact.companyId))
                .leftJoin(Contact, eq(CompanyContact.contactId, Contact.id))
                .leftJoin(ContactAddress, eq(Contact.id, ContactAddress.contactId))
                .leftJoin(Address, eq(ContactAddress.addressId, Address.id))
                .limit(limit).offset(offset).orderBy(desc(Company.name));
        }
        if (sort == 'asc') {
            return await db.select().from(Company)
            .leftJoin(CompanyContact,eq(Company.id,CompanyContact.companyId))
                .leftJoin(Contact, eq(CompanyContact.contactId, Contact.id))
                .leftJoin(ContactAddress, eq(Contact.id, ContactAddress.contactId))
                .leftJoin(Address, eq(ContactAddress.addressId, Address.id))
                .limit(limit).offset(offset).orderBy(asc(Company.name));
        }
        return await db.select().from(Company)
        .leftJoin(CompanyContact,eq(Company.id,CompanyContact.companyId))
            .leftJoin(Contact, eq(CompanyContact.contactId, Contact.id))
            .leftJoin(ContactAddress, eq(Contact.id, ContactAddress.contactId))
            .leftJoin(Address, eq(ContactAddress.addressId, Address.id))
            .limit(limit).offset(offset).orderBy(desc(Company.name));
    }

    async delete(id:string) {
        const exists = await db.select().from(Company).where(eq(Company.id, parseInt(id))).get();
        if (!exists) return null;
        const result = await db.delete(Company).where(eq(Company.id, parseInt(id))).returning();
        return result ? result[0] : null;
    }

    async getContacts(id:number) {
        return await db.select().from(CompanyContact)
        .leftJoin(Contact, eq(CompanyContact.contactId, Contact.id))
        .where(eq(CompanyContact.companyId, id)).get();
    }

    async getAddresses(id:number) {
        return await db.select().from(CompanyContact)
        .leftJoin(ContactAddress, eq(CompanyContact.contactId, ContactAddress.contactId))
        .leftJoin(Address, eq(ContactAddress.addressId, Address.id))
        .where(eq(CompanyContact.companyId, id)).get();
    }

    async getfill() {
        return await db.select({id:Company.id,name:Company.name,abbr:Company.abbreviation}).from(Company);
    }
}