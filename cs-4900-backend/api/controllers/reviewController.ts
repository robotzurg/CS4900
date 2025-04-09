import { createGenericController } from './genericController.ts';
import { ReviewService } from '../services/reviewService.ts';
import pkg from 'express';
import type { Review } from '../models/review.ts';

const reviewController = {
    ...createGenericController(ReviewService, 'review'),

    getAll: async (req: pkg.Request, res: pkg.Response): Promise<any> => {
        try {
            let userId = (req.query.userId as string) || null;
            let type = (req.query.type as string) || null;
            const items: Review[] = await new ReviewService().getAll({ userId: userId, type: type});
            res.json(items);
        } catch (err) {
            res.status(500).json({ error: `Error retrieving reviews: ${err}` });
        }
    },

    getReviews: async (req: pkg.Request, res: pkg.Response): Promise<any> => {
        try {
            const { musicType, musicId } = req.params;
            let userType = (req.query.userType as string) || null;
            let userId = (req.query.userId as string) || null; 

            let reviews: Review[] = [];
            reviews = await new ReviewService().getAllReviewsByMusicType(musicId, musicType, userType, userId);

            res.json(reviews);
        } catch (err) {
            res.status(500).json({ error: `Error retrieving reviews: ${err}` });
        }
    }
};

export default reviewController;