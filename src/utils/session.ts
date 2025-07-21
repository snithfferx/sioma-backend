import { APP_NAME, APP_DEBUG } from '@App/configs/constants';
import { generateSessionToken, generateCsrfToken, verifyToken } from './token';
import { set, saveCookie, getCrumb } from './cookies';
import type { AstroCookies } from 'astro';
const SESSION_NAME = 'x-' + APP_NAME.toLowerCase() + '-session';
// const API_TOKEN = 'x-' + APP_NAME + '-apisession';
const CSRF_TOKEN_NAME = 'x-csrf-token';

export interface SessionData {
	user: string;
	level: number;
	signature: string;
	name?: string;
	email?: string;
}

export async function createSessionToken(data: SessionData): Promise<string> {
	const res = generateSessionToken({
		name: data.name ?? '',
		email: data.email ?? '',
		level: data.level
	});
	return res ?? 'failed';
}

export async function getSession(request: Request): Promise<SessionData | null> {
	const sessionToken = getCrumb(request, SESSION_NAME);

	// const user = getCrumb(request, 'user');
	// console.info("User: ", user);
	// const csrf = getCrumb(request, CSRF_TOKEN_NAME);
	// console.info("CSRF: ", csrf);
	// if (!user || !csrf || !sessionToken) return null;
	// Extract the session token from the cookie
	if (!sessionToken || sessionToken === 'undefined') return null;

	try {
		const { payload } = await verifyToken(sessionToken);
		// Check if token has expired
		const exp = payload.exp ? new Date(payload.exp * 1000) : null;
		if (exp && exp < new Date()) return null;
		return payload as unknown as SessionData;
	} catch (e) {
		console.log(e);
		return null;
	}
}

export function generateSessionCookie(sessionToken: string) {
	return {
		name: SESSION_NAME, value: sessionToken, options: {
			httpOnly: true,
			secure: APP_DEBUG ? false : true,
			sameSite: 'lax',
			path: '/',
			maxAge: 60 * 60 * 4 // 4 hours
		}
	};
}

export async function csrfToken(req: Request): Promise<string | null> {
	return await generateCsrfToken(req);
}

export function setCsrfCookie(cookies: AstroCookies, token: string): void {
	saveCookie(cookies, CSRF_TOKEN_NAME, token, {
		httpOnly: true,
		secure: APP_DEBUG ? false : true,
		sameSite: 'lax',
		path: '/'
	});
}

export async function validateCsrfToken(request: Request): Promise<boolean> {
	const cookies = request.headers.get('cookie');
	if (!cookies) return false;
	const cookieToken = cookies.split(';')[0].split('=')[1] || '';
	const formToken = request.headers.get('x-csrf-token')?.split(';')[0].split('=')[1] || '';
	return cookieToken === formToken;
}

export function clearSessionCookie() {
	return set(SESSION_NAME, '', {
		httpOnly: true,
		secure: APP_DEBUG ? false : true,
		sameSite: 'lax',
		path: '/',
		maxAge: 0
	});
}

export function clearCsrfCookie() {
	return set(CSRF_TOKEN_NAME, '', {
		httpOnly: true,
		secure: APP_DEBUG ? false : true,
		sameSite: 'lax',
		path: '/'
	});
}

export async function isAuthenticated(req: Request): Promise<boolean> {
	// console.info("Checking authentication for request:", req.url);
	const Session = await getSession(req);
	return Session !== null;
}

export async function createSession(cookies: AstroCookies, data: SessionData) {
	// Generate session token
	const sessionToken = await createSessionToken(data);
	// Generate session cookie
	const sessionCookie = generateSessionCookie(sessionToken);
	// Set session cookie
	saveCookie(cookies, sessionCookie.name, sessionCookie.value, sessionCookie.options);
}