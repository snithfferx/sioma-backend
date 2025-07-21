import { db } from '@DB/sqlite';
import { eq, or } from 'drizzle-orm';
import { Person, User, UserLevel } from '@DB/sqlite/schema';

export class AuthModel {
	constructor() { }

	async findUser(email: string, user: string) {
		return await db
			.select()
			.from(User)
			.where(or(eq(User.email, email), eq(User.name, user)))
			.limit(1);
	}

	async getUserByEmail(email: string) {
		return await db
			.select({
				id: User.id,
				email: User.email,
				name: User.name,
				password: User.password,
				verifiedToken: User.verifiedToken,
				emailVerified: User.emailVerified,
				tokenExpiry: User.tokenExpiry,
				level: User.level,
				status: User.status,
			})
			.from(User)
			.where(eq(User.email, email));
	}

	async getUserByName(name: string) {
		return await db
			.select({
				id: User.id,
				email: User.email,
				name: User.name,
				password: User.password,
				verifiedToken: User.verifiedToken,
				emailVerified: User.emailVerified,
				tokenExpiry: User.tokenExpiry,
				level: User.level,
				status: User.status,
			})
			.from(User)
			.where(eq(User.name, name));
	}

	async getUserById(id: string) {
		return await db
			.select({
				id: User.id,
				email: User.email,
				name: User.name,
				password: User.password,
				verifiedToken: User.verifiedToken,
				emailVerified: User.emailVerified,
				tokenExpiry: User.tokenExpiry,
				resetToken: User.resetToken,
				apiToken: User.apiToken,
				level: {
					id: UserLevel.id,
					name: UserLevel.name,
					permissions: UserLevel.permissions,
				},
				status: User.status,
				person: {
					id: Person.id,
					firstName: Person.firstName,
					firstLastName: Person.firstLastName,
					secondLastName: Person.secondLastName,
					thirdLastName: Person.thirdLastName,
					thirdName: Person.thirdName,
					gender: Person.gender,
					birthday: Person.birthday,
					phone: Person.phone,
					email: Person.email,
				},
			})
			.from(User)
			.leftJoin(UserLevel, eq(User.level, UserLevel.id))
			.leftJoin(Person, eq(User.person, Person.id))
			.where(eq(User.id, id));
	}
}
