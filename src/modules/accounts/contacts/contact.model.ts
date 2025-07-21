import { db } from "@DB/sqlite";
import { Address, CompanyContact, Contact, ContactAddress, Person, Status, User } from "@DB/sqlite/schema";
import { asc, desc, eq } from "drizzle-orm";

export class ContactModel {
    async create(data: {
        name: string,
        email: string | null,
        phones: {
            home: string | null,
            work: string | null,
            mobile: string | null
        },
        social: {
            whatsapp: string | null,
            skype: string | null
        }
    }) {
        const exists = await db.select().from(Contact).where(eq(Contact.name, data.name)).get();
        if (exists) return exists;
        const result = await db.insert(Contact).values({
            name: data.name,
            email: data.email,
            homePhone: data.phones.home,
            workPhone: data.phones.work,
            mobilePhone: data.phones.mobile,
            whatsapp: data.social.whatsapp,
            skype: data.social.skype
        }).returning();
        return result ? result[0] : null;
    }

    async update(id: string, data: Partial<{
        name: string,
        email: string | null,
        phones: {
            home: string | null,
            work: string | null,
            mobile: string | null
        },
        social: {
            whatsapp: string | null,
            skype: string | null
        }
    }>) {
        const exists = await db.select().from(Contact).where(eq(Contact.id, parseInt(id))).get();
        if (!exists) return null;
        if (!data) return null;
        const newData = Object.fromEntries(
            Object.entries(data).filter(([_, value]) => value !== null)
        );
        const result = await db.update(Contact).set(newData).where(eq(Contact.id, parseInt(id))).returning();
        return result ? result[0] : null;
    }

    async getById(id: number) {
        const result = await db.select({
            id: Contact.id,
            name: Contact.name,
            email: Contact.email,
            homePhone: Contact.homePhone,
            workPhone: Contact.workPhone,
            mobilePhone: Contact.mobilePhone,
            whatsapp: Contact.whatsapp,
            skype: Contact.skype,
            address: Contact.addressId,
            user: Contact.userId,
            status: {
                id: Status.id,
                name: Status.name
            }
        })
        .from(Contact)
        .leftJoin(Status, eq(Contact.status, Status.id))
        .where(eq(Contact.id, id));
        // Get aditional data
        if (result && result.length > 0) {
            return await Promise.all((await result).map(async (item) => {
                const contactAddresses = await db.select().from(ContactAddress).where(eq(ContactAddress.contactId, item.id));
                const addresses = []; 
                contactAddresses.map(async contactAddress => addresses.push(await db.select().from(Address).where(eq(Address.id, contactAddress.addressId)).get()));
                const user = item.user ? await db.select({
                    id: User.id,
                    name: User.name,
                    email: User.email,
                    emailVerified: User.emailVerified,
                    level: User.level,
                    status: {
                        id: Status.id,
                        name: Status.name
                    },
                    person: Person
                }).from(User)
                .leftJoin(Status, eq(User.status, Status.id))
                .leftJoin(Person,eq(Person.id,User.person))
                .where(eq(User.id, item.user)) : [];
                return {
                    id: item.id,
                    name: item.name,
                    email: item.email,
                    homePhone: item.homePhone,
                    workPhone: item.workPhone,
                    mobilePhone: item.mobilePhone,
                    whatsapp: item.whatsapp,
                    skype: item.skype,
                    address: addresses,
                    user: user.length > 0 ? user[0] : null,
                    status: item.status
                };
            }))
        }
        return null;
    }

    async getAll(terms: string | null, page: number, limit: number, sort: string) {
        const offset = page > 1 ? (page - 1) * limit : 0;
        if (terms) {
            if (sort == 'asc') {
                return await db.select().from(Contact)
                    .limit(limit).offset(offset).orderBy(asc(Contact.name));
            }
            return await db.select().from(Contact)
                .limit(limit).offset(offset).orderBy(desc(Contact.name));
        }
        if (sort == 'asc') {
            return await db.select().from(Contact)
                .limit(limit).offset(offset).orderBy(asc(Contact.name));
        }
        return await db.select().from(Contact)
            .limit(limit).offset(offset).orderBy(desc(Contact.name));
    }

    async delete(id: string) {
        const exists = await db.select().from(Contact).where(eq(Contact.id, parseInt(id))).get();
        if (!exists) return null;
        const result = await db.delete(Contact).where(eq(Contact.id, parseInt(id))).returning();
        return result ? result[0] : null;
    }

    async getFill(who: string, id: string) {
        if (who == 'company') {
            return await db.select().from(Contact)
                .leftJoin(CompanyContact, eq(Contact.id, CompanyContact.contactId))
                .where(eq(CompanyContact.companyId, parseInt(id))).get();
        }
        if (who == 'user') {
            return await db.select().from(Contact)
                .where(eq(Contact.userId, id)).get();
        }
    }

    async getAddresses(id: number) {
        return await db.select().from(Contact)
            .leftJoin(ContactAddress, eq(Contact.id, ContactAddress.contactId))
            .where(eq(ContactAddress.contactId, id));
    }
}