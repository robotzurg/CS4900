import { GenericService } from './genericService.ts';
import type { Comment } from '../models/comment.ts';
import pool from '../config/db.ts';

export class CommentService extends GenericService<Comment> {
  constructor() {
    super('comments');
  }

  async getByReviewId(reviewId: string): Promise<any[]> {
        const query = `
        SELECT
            c.id,
            c.review_id,
            c.user_id,
            c.comment_text,
            c.timestamp,
            u.username,
            u.profile_picture
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.review_id = $1
        ORDER BY c.timestamp ASC
        `;
        const result = await pool.query(query, [reviewId]);
        return result.rows; 
    }   
}