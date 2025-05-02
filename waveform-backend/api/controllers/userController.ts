import { createGenericController } from './genericController.ts';
import pkg from 'express';
import { UserService } from '../services/userService.ts';
import type { User } from 'api/models/user.ts';

const userService = new UserService();

const userController = {
  ...createGenericController(UserService, 'user'),

  getByIdOrDiscordId: async (req: pkg.Request, res: pkg.Response): Promise<any> => {
    try {
        const userId = req.params['userId'];
        const item: User | null = await userService.getByIdOrDiscordId(userId);
        if (!item) return res.status(404).json({ error: `User not found` });
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: `Error retrieving user: ${err}` });
    }
  },
};

export default userController;
