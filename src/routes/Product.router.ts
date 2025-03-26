import { Router, Request, Response } from 'express';
import { ProductService } from '@Services/Product.service';
import { auth, AuthRequest } from '../middleware';

const productService = new ProductService();

export const ProductRouter = Router()
    .use(auth)
    .post('/create', async (req: AuthRequest, res: Response) => {
        try {
            const formData = req.body;
            const user = formData.user.id;
            const productData = formData.product;
            const newProduct = await productService.createProduct(productData, user);
            res.status(201).json(newProduct);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Invalid request' });
            }
        }
    })
    .get('/migrate', async (req: AuthRequest, res: Response) => {
        try {
            const request = req.query;
            const current = parseInt(request.page as string) || 0;
            const productData = await productService.getMigrationData(current);
            if (productData instanceof Error) {
                res.status(400).json({ error: productData.message })
            }
            res.status(201).json(productData);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Invalid request' });
            }
        }
    })
    .get('/all', async (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 100;
            const terms = req.query.terms as string || null;
            console.log("page", page, "limit", limit);
            const products = await productService.getAllProducts(terms, page, limit);
            res.json(products);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Invalid request' });
            }
        }
    })
    .get('/search', async (req: Request, res: Response) => {
        try {
            const terms = req.query.terms as string;
            // console.log("Terms: ", terms);
            const products = await productService.getProductByTerms(terms);
            res.json(products);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Invalid request' });
            }
        }
    })
    .get('/:id', async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const product = await productService.getProductById(id);
            if (product) {
                res.status(200).json(product);
            } else {
                res.status(404).json({ error: 'Product not found' });
            }
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: 'Invalid request' });
            }
        }
    });
