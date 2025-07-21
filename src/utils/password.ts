import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { APP_KEY } from '@App/configs/constants';

export const hashPassword = async (password: string): Promise<string> => {
	const hashedPassword = await bcrypt.hash(password, APP_KEY || 10);
	return hashedPassword;
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
	const validPassword = await bcrypt.compare(password, hashedPassword);
	return validPassword;
};

export const generatePassword = async (): Promise<string> => {
	const secret = crypto.randomUUID();
	// replace hyphen with empty string then shuffle the secret and take the first 8 characters
	const ramdimizedSecret = secret
		.replace(/-/g, '')
		.split('')
		.sort(() => 0.5 - Math.random())
		.slice(0, 8)
		.join('');
	return ramdimizedSecret;
};

export const generateResetTokenKey = async (): Promise<string> => {
	const secret = crypto.randomUUID();
	// replace hyphen with empty string
	const ramdimizedSecret = secret.replace(/-/g, '');
	return ramdimizedSecret;
};