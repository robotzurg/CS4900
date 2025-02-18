import pkg from 'express';
import pool from '../config/db.ts';

const router = pkg.Router();

// GET route to get all artists
router.get('/api/artists', async (req: pkg.Request, res: pkg.Response): Promise<any> => {

});

// GET route to get a specific artist
router.get('/api/artists/:artistId', async (req: pkg.Request, res: pkg.Response): Promise<any> => {

});

// POST route to create a new artist
router.post('/api/artists', async (req: pkg.Request, res: pkg.Response): Promise<any> => {

});

// PUT route to edit an artist
router.put('/api/artists/:artistId', async (req: pkg.Request, res: pkg.Response): Promise<any> => {

});

// DELETE route to delete an artist
router.delete('/api/artists/:artistId', async (req: pkg.Request, res: pkg.Response): Promise<any> => {

});

export default router;
