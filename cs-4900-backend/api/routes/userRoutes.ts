import pkg from 'express';
import pool from '../config/db.ts';

const router = pkg.Router();

// GET route to get a users profile
router.get('/api/users/:userId/profile', async (req: pkg.Request, res: pkg.Response): Promise<any> => {

});

// PUT route to edit a users profile
router.put('/api/users/:userId/profile', async (req: pkg.Request, res: pkg.Response): Promise<any> => {

});

// GET route to get a users friend list
router.get('/api/users/:userId/friends', async (req: pkg.Request, res: pkg.Response): Promise<any> => {

});

// POST route to add a friend
router.post('/api/users/:userId/friends/:friendId', async (req: pkg.Request, res: pkg.Response): Promise<any> => {

});

// DELETE route to remove a friend
router.delete('/api/users/:userId/friends/:friendId', async (req: pkg.Request, res: pkg.Response): Promise<any> => {

});

export default router;
