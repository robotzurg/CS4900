import pkg from 'express';
import pool from '../config/db.ts';

const router = pkg.Router();

//#region Song Reviews

// GET route to get all song reviews a user has made
router.get('/api/reviews/songs', async (req: pkg.Request, res: pkg.Response): Promise<any> => {

});

// GET route to get a single song review by ID.
router.get('/api/reviews/songs/:reviewId', async (req: pkg.Request, res: pkg.Response): Promise<any> => {

});

// PUT route to edit an existing song review.
router.put('/api/reviews/songs/:reviewId', async (req: pkg.Request, res: pkg.Response): Promise<any> => {

});

// DELETE route to delete an existing song review.
router.delete('/api/reviews/songs/:reviewId', async (req: pkg.Request, res: pkg.Response): Promise<any> => {

});

//#endregion

//#region Album Reviews

// GET route to get all album reviews a user has made
router.get('/api/review/albums', async (req: pkg.Request, res: pkg.Response): Promise<any> => {

});

// GET route to get a single album review by ID.
router.get('/api/review/albums/:reviewId', async (req: pkg.Request, res: pkg.Response): Promise<any> => {

});

// PUT route to edit an existing album review.
router.put('/api/review/albums/:reviewId', async (req: pkg.Request, res: pkg.Response): Promise<any> => {

});

// DELETE route to delete an existing album review.
router.delete('/api/review/albums/:reviewId', async (req: pkg.Request, res: pkg.Response): Promise<any> => {

});

//#endregion

//#region Comments

// GET route to get a reviews comments.
router.get('/api/review/:reviewId/comments', async (req: pkg.Request, res: pkg.Response): Promise<any> => {

});

// POST route to send a comment to a review.
router.post('/api/review/:reviewId/comments', async (req: pkg.Request, res: pkg.Response): Promise<any> => {

});

//#endregion

export default router;
