import { Router, Request, Response } from 'express';
import { CategoriesController } from '@Modules/categories/Categories.controller';
// import { auth, AuthRequest } from '../middleware';

const categoriesController = new CategoriesController();

export const CategoryRouter = Router()
    // .use(auth)
    .get('/all', async (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 100;
            const categories = await categoriesController.getAllCategories(page, limit);
            res.json(categories);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Invalid request' });
            }
        }
    })
    /* .get('/:id', async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const category = await categoriesController.getCategoryById(id);
            if (category) {
                res.status(200).json(category);
            } else {
                res.status(404).json({ error: 'Category not found' });
            }
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Invalid request' });
            }
        }
    }); */