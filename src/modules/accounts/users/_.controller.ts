import { UserModel } from './user.model';
import { hashPassword } from '@Utils/password';
import { PersonsController } from '../persons/_.controller';
import { generateJwtToken, generateResetToken } from '@Utils/token';
import * as crypto from 'crypto';


export class UsersController {
	model = new UserModel();
	personsController = new PersonsController();
	constructor() {
		// Initialize any necessary properties or services here
	}

	async addUser(data: {
		name: string;
		email: string;
		password: string;
		person: number;
		level: number;
		status?: number;
		phone?: string;
	}) {
		// Simulate fetching a user by ID
		if (!data.name || !data.email || !data.password) {
			return { status: 'fail', data: null, message: 'Name, email, and password are required.' };
		}
		const user = await this.model.createUser(data);
		if (user) {
			const signature = await this.saveSignature(user);
			return { status: 'ok', data: { id: user.id, email: data.email, name: user.name, signature: signature ?? '', level: data.level ?? 1 }, message: "User added successful" }
		} else {
			return { status: 'fail', data: null, message: "User is already sign up" };
		}
	}

	async createUser(data: {
		user: string;
		email: string;
		password: string;
		terms?: boolean;
	}) {
		if (!data.email || !data.password) {
			throw new Error('Email and password are required.');
		}
		const person = await this.personsController.addNewPerson({
			firstName: data.email.split('@')[0],
			firstLastName: data.email.split('@')[0],
			email: data.email
		});
		const hashedPassword = await hashPassword(data.password);
		if (person) {
			const user = await this.model.createUser({
				name: data.user ?? data.email.split('@')[0],
				email: data.email,
				password: hashedPassword,
				person: person.id,
				level: 1, // Default level
			});
			if (user) {
				const signature = generateJwtToken({
					user: {
						id: user.id,
						email: user.email,
						name: user.name,
						level: user.level ?? 1,
					},
					exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
				});
				// save signature
				await this.model.updateUserSignature(user.id, signature ?? '');
				// Generate reset token
				const resetToken = this.generateResetToken(user);
				if (resetToken) await this.model.updateUserResetToken(user.id, resetToken);
				return { status: 'ok', data: { id: user.id, email: data.email, signature: signature ?? '', level: user.level ?? 1 }, message: "User created successful" };
			}
		}
		return { status: 'fail', data: null, message: "User is already sign up" };
	}

	async getUserByEmail(email: string) {
		const user = await this.model.getByEmail(email);
		if (!user) {
			return { status: 'fail', data: null, message: 'User not found.' };
		}
		return { status: 'ok', data: user, message: 'User found.' };
	}

	async getUserByName(name: string) {
		const user = await this.model.getByEmail(name);
		if (!user) {
			return { status: 'fail', data: null, message: 'User not found.' };
		}
		return { status: 'ok', data: user, message: 'User found.' };
	}

	async getUserById(id: string) {
		const user = await this.model.getById(id);
		if (!user) {
			return { status: 'fail', data: null, message: 'User not found.' };
		}
		return { status: 'ok', data: user, message: 'User found.' };
	}

	async updateUserResetToken(id: string, resetToken: string) {
		return await this.model.updateUserResetToken(id, resetToken);
	}

	generateResetToken(user: {
		id: string,
		email: string,
		name: string,
		level: number | null,
		emailVerified: boolean | null,
		createdAt: Date,
		updatedAt: Date,
		deletedAt: Date | null
	}) {
		const info = {
			id: user.id,
			verified: user.emailVerified,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
			deletedAt: user.deletedAt
		}
		const hash = crypto.createHash('sha256').update(JSON.stringify(info)).digest('hex');
		const token = generateResetToken({
			user: {
				email: user.email,
				name: user.name,
				level: user.level ?? 1,
			},
			data: hash,
			exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 15) // 15 days
		});
		return token;
	}

	async saveSignature(user: {
		id: string,
		email: string,
		name: string,
		level: number | null,
		emailVerified: boolean | null,
		createdAt: Date,
		updatedAt: Date,
		deletedAt: Date | null
	}) {
		const signature = await generateToken({
			user: {
				email: user.email,
				name: user.name,
				level: user.level ?? 1,
			},
			exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
		});
		// save signature
		await this.model.updateUserSignature(user.id, signature ?? '');
		return signature;
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
		return await this.model.updateUser(id, data);
	}
}
