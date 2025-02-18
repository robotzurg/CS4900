import pkg from 'express';
import pool from '../config/db.ts';

const router = pkg.Router();

// GET route to get all albums
router.get('/api/albums', async (req: pkg.Request, res: pkg.Response): Promise<any> => {

});

// GET route to get a specific album
router.get('/api/albums/:albumId', async (req: pkg.Request, res: pkg.Response): Promise<any> => {

});

// POST route to create a new album
router.post('/api/albums', async (req: pkg.Request, res: pkg.Response): Promise<any> => {

});

// PUT route to edit an album
router.put('/api/albums/:albumId', async (req: pkg.Request, res: pkg.Response): Promise<any> => {

});

// DELETE route to delete an album
router.delete('/api/albums/:albumId', async (req: pkg.Request, res: pkg.Response): Promise<any> => {

});

export default router;
