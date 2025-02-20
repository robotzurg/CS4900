import pkg, { Request, Response } from 'express';
import pool from '../config/db.ts';

const router = pkg.Router();

// POST route for user registration
router.post('/api/auth/register', async (req: Request, res: Response) => {

});

// POST route for user login
router.post('/api/auth/login', async (req: Request, res: Response) => {

});

// POST route for user logout
router.post('/api/auth/logout', async (req: pkg.Request, res: pkg.Response) => {

});

export default router;
