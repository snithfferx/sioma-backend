import { Router, Request, Response } from "express";
import { AuthService } from '@Services/Auth.service';
import { LoginSchema, RegisterSchema } from '@Types/validators/Auth.validator';

const authService = new AuthService();

export const AuthRouter = Router()
    .post('/register', async (req: Request, res: Response) => {
        try {
            const validData = RegisterSchema.parse(req.body);

            const user = await authService.signup(validData);
            if (!user) {
                res.status(400).json({ message: 'User creation failed' });
            }
            res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Invalid request' });
            }
        }
    })
    .post('/login', async (req: Request, res: Response) => {
        try {
            const validData = LoginSchema.parse(req.body);

            const user = await authService.login(validData);

            if (!user) {
                res.status(401).json({ message: 'Login failed' });
            }

            res.status(200).json({
                message: 'Login successful',
                token: user?.token
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Invalid request' });
            }
        }
    })