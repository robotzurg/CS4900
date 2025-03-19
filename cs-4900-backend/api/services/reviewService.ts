import type { Review } from "../models/review.ts";
import pool from "../config/db.ts";
import { GenericService } from "./genericService.ts";

export class ReviewService extends GenericService<Review> {
    constructor() {
        super('reviews');
    }

    async getAllByMusicType(musicId: string, type: string): Promise<Review[]> {
        const query = `SELECT * FROM reviews WHERE ${type}_id = $1`;
        const { rows } = await pool.query(query, [musicId]);
        return rows;
    }

    async getAllReviewsFromMusic(musicId: string, reviewId: string, type: string): Promise<Review[]> {
        const query = `SELECT * FROM reviews WHERE ${type}_id = $1 AND id = $2`;
        const { rows } = await pool.query(query, [musicId, reviewId]);
        return rows;
    }
}
