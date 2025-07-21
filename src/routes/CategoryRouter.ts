import { Router, Request, Response } from 'express';
import { CommonNamesController } from '@Modules/common_names/commonNames.controller';
// import { auth, AuthRequest } from '../middleware';

const Controller = new CommonNamesController();

export const CategoryRouter = Router()
    .post('/create', async (req: Request, res: Response) => {
        try {
            const commonName = await Controller.createCommonName(req.body);
            res.status(200).json(commonName);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    })
    .get('/all', async (req: Request, res: Response) => {
        const { terms, page, limit, active, sort } = req.query;
        try {
            const commonNames = await Controller.getAllCommonNames(terms as string, parseInt(page as string), parseInt(limit as string), active as unknown as boolean, sort as string);
            res.status(200).json(commonNames);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    })
    .get('/filter', async (res: Response) => {
        try {
            const commonNames = await Controller.selectFillCommonNames();
            res.status(200).json(commonNames);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    })
    .get('/:id', async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const commonName = await Controller.getCommonNameById(parseInt(id as string));
            res.status(200).json(commonName);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    });