import { createGenericController } from './genericController.ts';
import pkg from 'express';
import type { Comment } from '../models/comment.ts';
import { CommentService } from '../services/commentService.ts';

const commentService = new CommentService();

const commentController = {
  ...createGenericController(CommentService, 'comment'),

  getByReviewId: async (req: pkg.Request, res: pkg.Response): Promise<void> => {
    try {
      const { reviewId } = req.params;
      if (!reviewId) {
        res.status(400).json({ error: 'Missing reviewId parameter' });
        return;
      }

      const comments: Comment[] = await commentService.getByReviewId(reviewId);
      res.json(comments);
    } catch (err) {
      res.status(500).json({ error: `Error retrieving comments: ${err}` });
    }
  }
};

export default commentController;
