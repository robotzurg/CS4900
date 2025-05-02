import { Router } from 'express';
import reviewController from '../controllers/reviewController.ts';

const router = Router();

router.get('/api/reviews', reviewController.getAll);
router.get('/api/reviews/:musicType/:musicId', reviewController.getReviews);
router.get('/api/reviews/:reviewId', reviewController.getById);
router.post('/api/reviews', reviewController.create); 
router.put('/api/reviews/:reviewId', reviewController.update);
router.delete('/api/reviews/:reviewId', reviewController.delete);

export default router;