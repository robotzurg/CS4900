import type { Review } from "../models/review.ts";
import pool from "../config/db.ts";
import { GenericService } from "./genericService.ts";

export class ReviewService extends GenericService<Review> {
    constructor() {
        super('reviews');
    }

    async getAll(filter?: { userId?: string | null }): Promise<Review[]> {
        let query = `SELECT * FROM reviews`;
        const params: any[] = [];

        if (filter?.userId) {
            query += ` WHERE user_id = $1`;
            params.push(filter.userId);
        }

        const { rows } = await pool.query(query, params);
        return rows;
    }

    async getAllReviewsByMusicType(musicId: string, type: string, userType?: string | null, userId?: string | null): Promise<Review[]> {
        if (type == 'songs') type = 'song';
        else if (type == 'albums') type = 'album';
        let query = `SELECT * FROM reviews WHERE ${type}_id = $1`;
        let params: any[] = [musicId];

        if (userType) {
            query += ` AND user_id IN (SELECT id FROM users WHERE user_type = $${params.length + 1})`;
            params.push(userType);
        }

        if (userId) {
            query += ` AND user_id = $${params.length + 1}`;
            params.push(userId);
        }

        const { rows } = await pool.query(query, params);
        return rows;
    }
}
