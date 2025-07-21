import { db } from '@DB/sqlite';
import { User } from '@DB/sqlite/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
export class UserModel {
	constructor() { }
	async getById(id: string) {
		const user = await db.select({
			id: User.id,
			email: User.email,
			name: User.name,
			password: User.password,
			verifiedToken: User.verifiedToken,
			emailVerified: User.emailVerified,
			tokenExpiry: User.tokenExpiry,
			level: User.level,
			status: User.status,
			apiToken: User.apiToken,
			person: User.person,
		}).from(User).where(eq(User.id, id)).get();
		return user;
	}
	async getByEmail(email: string) {
		const user = await db.select({
			id: User.id,
			email: User.email,
			name: User.name,
			password: User.password,
			verifiedToken: User.verifiedToken,
			emailVerified: User.emailVerified,
			tokenExpiry: User.tokenExpiry,
			level: User.level,
			status: User.status,
			person: User.person,
		}).from(User).where(eq(User.email, email)).get();
		return user;
	}
	async getByName(name: string) {
		// console.info("Getting user by name", name);
		const user = await db.select({
			id: User.id,
			email: User.email,
			name: User.name,
			password: User.password,
			verifiedToken: User.verifiedToken,
			emailVerified: User.emailVerified,
			tokenExpiry: User.tokenExpiry,
			level: User.level,
			status: User.status,
			person: User.person,
		}).from(User).where(eq(User.name, name)).get();
		return user ? user : null;
	}
	async createUser(user: {
		name: string;
		email: string;
		password: string;
		person: number;
		level: number;
		status?: number;
		phone?: string;
	}) {
		const exists = await db.select().from(User).where(eq(User.email, user.email));
		if (exists.length > 0) return exists[0];
		const result = await db
			.insert(User)
			.values({
				id: await this.generateUuid(),
				name: user.name,
				email: user.email,
				password: user.password,
				person: user.person,
				level: user.level,
				status: user.status ?? 1,
				phone: user.phone ?? null
			})
			.returning();
		return result ? result[0] : null;
	}
	async generateUuid() {
		const uuid = uuidv4();
		const exists = await db.select().from(User).where(eq(User.id, uuid)).get();
		if (exists) {
			this.generateUuid();
		}
		return uuid;
	}

	async updateUserData(id: string, person: number) {
		await db
			.update(User)
			.set({
				person: person
			})
			.where(eq(User.id, id));
	}

	async updateUserSignature(id: string, signature: string) {
		const today = new Date();
		await db
			.update(User)
			.set({
				verifiedToken: signature,
				tokenExpiry: new Date(today.setHours(today.getHours() + 24)) // 24 hours
			})
			.where(eq(User.id, id));
	}

	async getUserByEmail(email: string) {
		return await db
			.select({
				id: User.id,
				email: User.email,
				userName: User.name,
				password: User.password
			})
			.from(User)
			.where(eq(User.email, email));
	}

	async updateUserResetToken(id: string, resetToken: string) {
		await db
			.update(User)
			.set({
				resetToken: resetToken
			})
			.where(eq(User.id, id));
	}

	async updateUser(id: string, data: {
		email?: string;
		password?: string;
		level?: number;
		emailVerified?: boolean;
		createdAt?: Date;
		updatedAt?: Date;
		deletedAt?: Date;
	}) {
		return await db
			.update(User)
			.set(data)
			.where(eq(User.id, id));
	}
}
