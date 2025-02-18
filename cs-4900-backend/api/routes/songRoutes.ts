import pkg from 'express';
import pool from '../config/db.ts';

const router = pkg.Router();

// GET route to get all songs
router.get('/api/songs', async (req: pkg.Request, res: pkg.Response): Promise<any> => {

});

// GET route to get a specific song
router.get('/api/songs/:songId', async (req: pkg.Request, res: pkg.Response): Promise<any> => {

});

// POST route to create a new song
router.post('/api/songs', async (req: pkg.Request, res: pkg.Response): Promise<any> => {

});

// PUT route to edit an song
router.put('/api/songs/:songId', async (req: pkg.Request, res: pkg.Response): Promise<any> => {

});

// DELETE route to delete an song
router.delete('/api/songs/:songId', async (req: pkg.Request, res: pkg.Response): Promise<any> => {

});

export default router;
