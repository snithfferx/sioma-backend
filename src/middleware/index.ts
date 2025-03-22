import { Request, Response, NextFunction } from "express";
import { verifyToken } from '@Utils/token';

export const auth = async (
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new Error("Unauthorized");
        }

        const decoded = await verifyToken(token).catch(() => {
            throw new Error("Unauthorized");
        }) as {
            id: number;
            email: string;
        };

        // req.user = decoded;
        _next();
    } catch (err) {
        res.status(401).json({ error: 'Please authenticate' });
    }
};

export interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
    };
}
