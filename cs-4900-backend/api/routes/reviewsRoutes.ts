import { Router } from 'express';
import reviewController from '../controllers/reviewController.ts';

const router = Router();

router.get('/api/reviews', reviewController.getAll);
router.get('/api/reviews/:musicId', reviewController.getReviews);
router.post('/api/reviews', reviewController.create);
router.put('/api/reviews/:reviewId', reviewController.update);
router.delete('/api/reviews/:reviewId', reviewController.delete);

export default router;