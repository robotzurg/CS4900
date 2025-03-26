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

    async getAllReviewsFromMusic(musicId: string, reviewId: string, type: string, userType: string): Promise<Review[]> {
        let query = `
            SELECT * FROM reviews 
            WHERE ${type}_id = $1 AND id = $2
        `;
        let params = [musicId, reviewId];

        console.log(userType);

        if (userType) {
            query += ` AND user_id IN (SELECT id FROM users WHERE user_type = $3)`;
            params.push(userType);
        }
        const { rows } = await pool.query(query, params);
        return rows;
    }
}
