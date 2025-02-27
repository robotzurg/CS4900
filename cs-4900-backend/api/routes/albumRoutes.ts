import { Router } from 'express';
import { AlbumService } from '../services/albumService.ts';
import { createGenericController } from '../controllers/genericController.ts';

const router = Router();
const albumController = createGenericController(AlbumService, 'album');

router.get('/api/albums', albumController.getAll);
router.get('/api/albums/:albumId', albumController.getById);
router.get('/api/albums/search/:name', albumController.getByName);
router.post('/api/albums', albumController.create);
router.put('/api/albums/:albumId', albumController.update);
router.delete('/api/albums/:albumId', albumController.delete);

export default router;
