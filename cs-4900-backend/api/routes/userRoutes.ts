import pkg from 'express';
import pool from '../config/db.ts';
import { UserService } from '../services/userService.ts';
import { createGenericController } from '../controllers/genericController.ts';

const router = pkg.Router();
const userController = createGenericController(UserService, 'user');

router.get('/api/users', userController.getAll);
router.get('/api/users/:userId', userController.getById);
router.post('/api/users', userController.create);
router.put('/api/users/:userId', userController.update);
router.delete('/api/users/:userId', userController.delete);

export default router;
