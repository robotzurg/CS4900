import pkg from 'express';
import pool from '../config/db.ts';

const router = pkg.Router();

// GET route to get song/album recommendations
router.get('/api/recommendations', async (req: pkg.Request, res: pkg.Response): Promise<any> => {

});

export default router;
