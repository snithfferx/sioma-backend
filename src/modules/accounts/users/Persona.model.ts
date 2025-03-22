import { db } from '@DB/sqlite';
import { eq, or } from 'drizzle-orm';
import { Users, Person } from '@DB/sqlite/schema';
import { Persona } from '@Schemas/Persona.schema';

export class PersonaModel {
    constructor() { }

    async addNewPerson(data: Persona) {
        if (!data.firstName || !data.firstLastName) {
            return null;
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
                address: data.address,
                phone: data.phone
            })
            .returning();
        this.updateUserData(persona[0].id);
        return persona;
    }

    async updateUserData(id: number) {
        await db
            .update(Users)
            .set({
                person: id
            })
            .where(eq(Users.id, id));
    }

    async getUserByEmail(email: string) {
        return await db
            .select({
                id: Users.id,
                email: Users.email,
                userName: Users.userName,
                password: Users.password
            })
            .from(Users)
            .where(eq(Users.email, email));
    }
}
