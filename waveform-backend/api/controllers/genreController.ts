import { createGenericController } from './genericController.ts';
import { GenreService } from '../services/genreServices.ts';
import pkg from 'express';

const genreService = new GenreService();

const genreController = {
  ...createGenericController(GenreService, 'genre'),

  create: async (req: pkg.Request, res: pkg.Response): Promise<void> => {
    try {
      const { songIds = [], albumIds = [], ...data } = req.body;
      const newGenre = await genreService.create(data, songIds, albumIds);
      
      res.status(201).json(newGenre);
    } catch (err: any) {
      console.error('Error creating genre:', err);
      res.status(500).json({ error: `Error creating genre: ${err.message}` });
    }
  },
};

export default genreController;
