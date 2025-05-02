import pkg from 'express';
import userController from '../controllers/userController.ts';

const router = pkg.Router();

router.get('/api/users', userController.getAll);
router.get('/api/users/:userId', userController.getByIdOrDiscordId);
router.post('/api/users', userController.create);
router.put('/api/users/:userId', userController.update);
router.delete('/api/users/:userId', userController.delete);

export default router;
