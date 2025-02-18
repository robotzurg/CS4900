import pkg from 'express';
import pool from '../config/db.ts';

const router = pkg.Router();

// DELETE route to delete a comment.
router.get('/api/comments/:commentId', async (req: pkg.Request, res: pkg.Response): Promise<any> => {

});

export default router;
