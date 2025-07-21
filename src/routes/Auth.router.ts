import { Router, Request, Response, NextFunction } from "express";
import { AuthService } from '@Services/Auth.service';
import { LoginSchema, RegisterSchema } from '@Types/validators/Auth.validator';
import { AuthController } from "@Modules/accounts/auth/_.controller";

const authService = new AuthService();
const Controller = new AuthController();

// --- Helper para validar con Zod ---
const validate = (schema: z.ZodSchema<any>) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        next(error);
    }
};

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
    .post('sign-up', async (req, res) => {
        try {
            const { username, email, password } = req.body;
            const result = await Controller.registerUser({
                email: email,
                password: password,
                userName: username
            });
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    })
    .post('/forgot-password', async (req, res) => {
        try {
            const { email } = req.body;
            const result = await Controller.forgotPassword(email);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    })
    .post('/reset-password', async (req, res) => {
        try {
            const { token, newPassword } = req.body;
            const result = await Controller.changePassword(token, newPassword);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    })
    .post('/verify-email', async (req, res) => {
        try {
            const { token } = req.body;
            const result = await Controller.verifyEmail(token);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    })
    .post('/sign-in', async (req, res) => {
        try {
            const { email, password } = req.body;
            const result = await Controller.login(email, password);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    });