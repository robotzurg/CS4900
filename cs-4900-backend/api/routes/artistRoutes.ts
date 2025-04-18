import { Router } from 'express';
import { ArtistService } from '../services/artistService.ts';
import { createGenericController } from '../controllers/genericController.ts';

const router = Router();
const artistController = createGenericController(ArtistService, 'artist');

router.get('/api/artists', artistController.getAll);
router.get('/api/artists/:artistId', artistController.getById);
router.post('/api/artists', artistController.create);
router.put('/api/artists/:artistId', artistController.update);
router.delete('/api/artists/:artistId', artistController.delete);

export default router;
