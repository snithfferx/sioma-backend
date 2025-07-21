import { db } from '@DB/sqlite';
import { eq } from 'drizzle-orm';
import type { Persona } from '@Types/accounts/persons/persona.schema';
import { Contact, Person } from '@DB/sqlite/schema';
export class PersonModel {
    constructor() { }

    async addNewPerson(data: Partial<Persona>) {
        if (!data.firstName || !data.firstLastName) {
            return null;
        }
        try {
            const exists = await db.select().from(Person).where(eq(Person.firstName, data.firstName)).get();
            if (exists) {
                return exists;
            }
            const persona = await db
                .insert(Person)
                .values({
                    firstName: data.firstName,
                    secondName: data.secondName,
                    firstLastName: data.firstLastName,
                    secondLastName: data.secondLastName,
                    thirdName: data.thirdName,
                    thirdLastName: data.thirdLastName,
                    gender: data.gender,
                    birthday: data.birthday ? new Date(data.birthday) : null,
                    phone: data.phone,
                    email: data.email
                })
                .returning();
            return persona[0];
        } catch (error) {
            console.error("Create Person Error: ", error);
            return null;
        }
    }

    async addNewContact(data: {
        name: string;
        email: string;
        homePhone?: string;
        mobilePhone?: string;
        workPhone?: string;
        addressId?: number;
        skype?: string;
        whatsapp?: string;
        status: number;
    }) {
        if (!data.name || !data.email) {
            return null;
        }
        const contact = await db
            .insert(Contact)
            .values({
                name: data.name,
                email: data.email,
                homePhone: data.homePhone ?? null,
                mobilePhone: data.mobilePhone ?? null,
                workPhone: data.workPhone ?? null,
                addressId: data.addressId ?? null,
                skype: data.skype ?? null,
                whatsapp: data.whatsapp ?? null,
                status: data.status
            })
            .returning();
        return contact;
    }

    async signupPerson(data: {
        firstName: string;
        firstLastName: string;
        email: string;
    }) {
        try {
            const exists = await db.select().from(Person).where(eq(Person.firstName, data.firstName)).get();
            if (exists) {
                return exists;
            }
            const persona = await db
                .insert(Person)
                .values({
                    firstName: data.firstName,
                    firstLastName: data.firstLastName,
                    email: data.email
                })
                .returning();
            return persona[0];
        } catch (error) {
            console.error("Create Person Error: ", error);
            return null;
        }
    }

    async getById(id: number) {
        return await db.select().from(Person).where(eq(Person.id, id)).get();
    }
}