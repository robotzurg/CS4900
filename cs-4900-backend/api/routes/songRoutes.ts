import { Router } from 'express';
import { SongService } from '../services/songService.ts';
import { createGenericController } from '../controllers/genericController.ts';

const router = Router();
const songController = createGenericController(SongService, 'song');

router.get('/api/songs', songController.getAll);
router.get('/api/songs/:songId', songController.getById);
router.post('/api/songs', songController.create);
router.put('/api/songs/:songId', songController.update);
router.delete('/api/songs/:songId', songController.delete);

export default router;
