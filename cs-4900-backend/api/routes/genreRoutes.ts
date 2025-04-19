import { Router } from 'express';
import genreController from '../controllers/genreController.ts';

const router = Router();

router.get('/api/genres', genreController.getAll);
router.get('/api/genres/:genreId', genreController.getById);
router.post('/api/genres', genreController.create);
router.put('/api/genres/:genreId', genreController.update);
router.delete('/api/genres/:genreId', genreController.delete);

export default router;
