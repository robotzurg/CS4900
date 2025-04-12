import { Router } from 'express';
import { createGenericController } from '../controllers/genericController.ts';
import { GenreService } from '../services/genreServices.ts';

const router = Router();
const genreController = createGenericController(GenreService, 'genre');

router.get('/api/genres', genreController.getAll);
router.get('/api/genres/:genreId', genreController.getById);
router.post('/api/genres', genreController.create);
router.put('/api/genres/:genreId', genreController.update);
router.delete('/api/genres/:genreId', genreController.delete);

export default router;
