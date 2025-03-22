import Jwt from "jsonwebtoken";
import { APP_SECRET, JWT_EXPIRATION } from '@Configs/constants';
import bcrypt from 'bcryptjs';

export const generateToken = async (payload: {
    id: number;
    email: string;
}) => {
    if (!APP_SECRET || !JWT_EXPIRATION) {
        throw new Error('APP_SECRET or JWT_EXPIRATION is not defined');
    }
    const secret = await bcrypt.hash(APP_SECRET, 10);
    return Jwt.sign({
        sub: payload.id,
        email: payload.email,
        iat: Date.now(),
        exp: Date.now() + 1000 * 60 * 60 * Number(JWT_EXPIRATION) // 1 day
    }, secret, { expiresIn: Number(JWT_EXPIRATION) });
}

export const verifyToken = async (token: string) => {
    if (!APP_SECRET || !JWT_EXPIRATION) {
        throw new Error('APP_SECRET or JWT_EXPIRATION is not defined');
    }
    const secret = await bcrypt.hash(APP_SECRET, 10);
    return Jwt.verify(token, secret);
}
