import { APP_SECRET, CSRF_TOKEN_NAME, JWT_EXPIRES, JWT_SECRET } from '@Configs/constants';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
// import type { UserSessionSchema } from '@Types/schemas/accounts/user.schema';
// import { jwtVerify, SignJWT } from 'jose';
import { v4 as uuidv4 } from 'uuid';
// import { getCrumb } from './cookies';
// const key = new TextEncoder().encode(JWT_SECRET || APP_SECRET);

export const generateToken = async (payload: { user?: UserSessionSchema; usb?: string; exp?: number }) => {
	const exp = payload.exp || JWT_EXPIRES || 24 * 60 * 60; // Default to 24 hours if not provided
	// If user and usb is undefined, return null
	if (!payload.user || !payload.usb) return null;
	if (!JWT_SECRET) throw new Error('JWT_SECRET is not set');
	const jwtPayload = {
		sub: uuidv4(),
		email: payload.user.email,
		username: payload.user.name,
		level: payload.user.level,
	};
	const token = jwt.sign(jwtPayload, JWT_SECRET, {
		expiresIn: exp,
	})
		// .setProtectedHeader({ alg: 'HS256' })
		// .setExpirationTime(exp)
		// .setIssuer('shopingui')
		// .setAudience('shopingui')
		// .sign(key);
	return token;
};

// export const verifyToken = async (token: string) => {
// 	const decodedToken = await jwtVerify(token, key, {
// 		issuer: 'shopingui',
// 		audience: 'shopingui',
// 		algorithms: ['HS256']
// 	});
// 	return decodedToken;
// };

// export const generateCsrfTokenKey = async () => {
// 	const secret = uuidv4();
// 	// replace hyphen with empty string
// 	const ramdimizedSecret = secret.replace(/-/g, '');
// 	return ramdimizedSecret;
// };

// export const generateCsrfToken = async (req: Request | null) => {
// 	// If astro is null, generate a new token
// 	if (!req || req === null) {
// 		const token = await generateToken({
// 			usb: await generateCsrfTokenKey(),
// 			exp: 60 * 60
// 		});
// 		if (token) {
// 			return token;
// 		}
// 	}
// 	const cookie = req ? getCrumb(req, CSRF_TOKEN_NAME) : undefined;
// 	if (cookie) {
// 		// const tokenValue = cookie.value;
// 		// return tokenValue;
// 		return cookie;
// 	}
// 	return null;
// };

// export const generateResetToken = (payload: { user: UserSessionSchema; exp: number; data: string }) => {
// 	// If user and usb is undefined, return null
// 	if (!payload.user || !payload.data) return null;
// 	const token = new SignJWT({
// 		sub: uuidv4(),
// 		user: payload.user,
// 		data: payload.data
// 	})
// 		.setProtectedHeader({ alg: 'HS256' })
// 		.setExpirationTime(payload.exp)
// 		.setIssuer('shopingui')
// 		.setAudience('shopingui')
// 		.sign(key);
// 	return token;
// };

// export const generateSessionToken = (payload: UserSessionSchema) => {
// 	// If user is undefined, return null
// 	if (!payload) return null;
// 	const token = new SignJWT({
// 		sub: uuidv4(),
// 		email: payload.email,
// 		username: payload.name,
// 		level: payload.level
// 	})
// 		.setProtectedHeader({ alg: 'HS256' })
// 		.setExpirationTime('24h')
// 		.setIssuer('shopingui')
// 		.setAudience('shopingui')
// 		.sign(key);
// 	return token;
// }

// export const generateJWK = () => {
// 	const jwk = {
// 		kty: 'oct',
// 		k: JWT_SECRET || APP_SECRET, // Generate a random key if JWT_KEY is not set
// 		use: 'sig',
// 		alg: 'HS256',
// 		kid: uuidv4() // Key ID for identification
// 	};
// 	return jwk;
// }

export const generateJwtToken = (userId: string): string => {
	if (!JWT_SECRET) throw new Error('JWT_SECRET is not set');
	return jwt.sign({ id: userId }, JWT_SECRET, {
		expiresIn: JWT_EXPIRES,
	});
};

export const verifyJwtToken = (token: string): string | jwt.JwtPayload => {
	if (!JWT_SECRET) throw new Error('JWT_SECRET is not set');
	return jwt.verify(token, JWT_SECRET);
};

export const generateResetToken = (userId: string): string => {
	if (!JWT_SECRET) throw new Error('JWT_SECRET is not set');
	const resetToken = crypto.randomBytes(32).toString('hex');
	// Firmar el token con JWT para asegurar su integridad y añadir caducidad
	return jwt.sign({ id: userId, token: resetToken }, JWT_SECRET, {
		expiresIn: '15m', // El token de reset expira en 15 minutos
	});
};

export const generateEmailVerificationToken = (userId: string): string => {
	if (!JWT_SECRET) throw new Error('JWT_SECRET is not set');
	const verificationToken = crypto.randomBytes(32).toString('hex');
	// Firmar el token con JWT para asegurar su integridad y añadir caducidad
	return jwt.sign({ id: userId, token: verificationToken }, JWT_SECRET, {
		expiresIn: '24h', // El token de verificación de email expira en 24 horas
	});
};

export const verifyResetToken = (token: string): string | jwt.JwtPayload => {
	if (!JWT_SECRET) throw new Error('JWT_SECRET is not set');
	return jwt.verify(token, JWT_SECRET);
};

export const verifyEmailVerificationToken = (token: string): string | jwt.JwtPayload => {
	if (!JWT_SECRET) throw new Error('JWT_SECRET is not set');
	return jwt.verify(token, JWT_SECRET);
};