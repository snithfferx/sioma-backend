import { Router, Request, Response } from 'express';
import { CategoriesController } from '@Modules/categories/_.controller';
import { auth, AuthRequest } from '../middleware';

const Controller = new CategoriesController();

export const CommonNameRouter = Router()
    .use(auth)
    .post('/create', async (req: AuthRequest, res: Response) => {
        try {
            const categories = await Controller.createCategory(req.body);
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    })
    .get('/all', async (req: Request, res: Response) => {
        const { terms, page, limit, active, sort } = req.query;
        try {
            const categories = await Controller.getAllCategories(terms as string, parseInt(page as string), parseInt(limit as string), active as unknown as boolean, sort as string);
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    })
    .get('/filter', async (res: Response) => {
        try {
            const categories = await Controller.categoryFilter();
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    })
    .get('/:id', async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const category = await Controller.getCategoryById(parseInt(id as string));
            res.status(200).json(category);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    });