import type { AstroCookies } from 'astro';
import { parse, serialize } from 'cookie';

export function get(req: Request) {
    const cookies = req.headers ? req.headers.get('cookie') : null;
    if (!cookies) return {};
    return parse(cookies);
}

export function getCrumb(request: Request, name: string) {
    const cookies = get(request);
    return cookies[name];
}

export function set(name: string, value: string, options: Record<string, any> = {}) {
    return serialize(name, value, options);
}

export function saveCookie(cookies: AstroCookies, name: string, value: string, options: {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: string;
    path?: string;
    maxAge?: number;
}) {
    cookies.set(name, value, {
        httpOnly: options.httpOnly,
        secure: options.secure,
        sameSite: options.sameSite as 'lax' | 'strict' | 'none',
        path: options.path,
        maxAge: options.maxAge
    });
}

export function deleteCookie(cookies: AstroCookies, name: string) {
    cookies.delete(name);
}