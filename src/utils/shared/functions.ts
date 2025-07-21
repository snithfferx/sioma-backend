import { APP_URI } from '@App/configs/constants';

export function url(path: string): string {
	return `${APP_URI}/${path}`;
}

export function asset(path: string): string {
	return `${APP_URI}/assets/${path}`;
}

export function generateUID(): string {
	return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
