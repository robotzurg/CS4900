import pkg from 'express';
import pool from '../config/db.ts';

const router = pkg.Router();

// GET route to get all mail in a mailbox
router.get('/api/mail', async (req: pkg.Request, res: pkg.Response): Promise<any> => {

});

// POST route to send a mail message to another user
router.post('/api/mail', async (req: pkg.Request, res: pkg.Response): Promise<any> => {

});

// POST route to delete a specific mail in a mailbox
router.delete('/api/mail/:mailId', async (req: pkg.Request, res: pkg.Response): Promise<any> => {

});

// DELETE route to delete all mail in a mailbox
router.delete('/api/mail', async (req: pkg.Request, res: pkg.Response): Promise<any> => {

});

export default router;
