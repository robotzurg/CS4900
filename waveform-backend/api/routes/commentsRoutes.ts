import { Router } from 'express';
import commentController from '../controllers/commentController.ts';

const router = Router();

router.get('/api/comments', commentController.getAll);
router.get('/api/comments/:commentId', commentController.getById);
router.get(`/api/comments/review/:reviewId`, commentController.getByReviewId);
router.post('/api/comments', commentController.create);
router.put('/api/comments/:commentId', commentController.update);
router.delete('/api/comments/:commentId', commentController.delete);

export default router;
