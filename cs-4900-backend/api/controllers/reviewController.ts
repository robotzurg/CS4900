import { createGenericController } from './genericController.ts';
import { ReviewService } from '../services/reviewService.ts';
import pkg from 'express';
import type { Review } from '../models/review.ts';

const reviewController = {
    ...createGenericController(ReviewService, 'review'),

    getReviews: async (req: pkg.Request, res: pkg.Response): Promise<any> => {
        try {
            const { musicId } = req.params;
            let type = (req.query.type as string) || "song";
            let userType = (req.query.userType as string) || "user";
            let reviewId = req.query.reviewId as string | undefined;

            let reviews: Review[] = [];
            if (!reviewId) {
                reviews = await new ReviewService().getAllByMusicType(musicId, type);
            } else {
                reviews = await new ReviewService().getAllReviewsFromMusic(musicId, reviewId, type, userType);
            }

            res.json(reviews);
        } catch (err) {
            res.status(500).json({ error: `Error retrieving reviews: ${err}` });
        }
    }
};

export default reviewController;