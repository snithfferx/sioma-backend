import { Request, Response, NextFunction } from 'express';
import { verifyJwtToken } from '@Utils/token';
import { UsersController } from '@Modules/accounts/users/_.controller';
import jwt from 'jsonwebtoken';

const Controller = new UsersController();

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
    }

    try {
        const decoded = verifyJwtToken(token) as jwt.JwtPayload;
        req.userId = decoded.id;
        if (!req.userId) return res.status(401).json({ message: 'Usuario no encontrado.' });
        const user = await Controller.getUserById(req.userId);
        if (!user) {
            return res.status(401).json({ message: 'Usuario no encontrado.' });
        }
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Token inválido o expirado.' });
        }
        next(error);
    }
};