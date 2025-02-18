import pkg from 'express';
import pool from '../config/db.ts';

const router = pkg.Router();

// POST route to connect a Spotify account to a user.
router.post('/api/spotify/connect', async (req: pkg.Request, res: pkg.Response): Promise<any> => {

});

// GET route to get the users currently playing data on Spotify.
router.get('/api/spotify/nowplaying', async (req: pkg.Request, res: pkg.Response): Promise<any> => {

});

export default router;
