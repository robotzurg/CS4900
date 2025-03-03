// import pool from "../config/db.ts";

// export class ReviewService {
//     async getAll(id: string, type: "song" | "album") {
//         const query = `SELECT * FROM reviews WHERE ${type}_id = $1`;
//         const { rows } = await pool.query(query, [id]);
//         return rows;
//     }

//     async getById(id: string, reviewId: string, type: "song" | "album") {
//         const query = `SELECT * FROM reviews WHERE ${type}_id = $1 AND id = $2`;
//         const { rows } = await pool.query(query, [id, reviewId]);
//         return rows[0] || null;
//     }

//     async create(id: string, type: "song" | "album", data: any) {
//         const query = `
//             INSERT INTO reviews (id, user_id, rating, review_text, timestamp)
//             VALUES ($1, $2, $3, $4, NOW()) RETURNING *`;
//         const { rows } = await pool.query(query, [id, data.user_id, data.rating, data.review_text]);
//         return rows[0];
//     }

//     async update(id: string, reviewId: string, type: "song" | "album", data: any) {
//         const query = `
//             UPDATE reviews
//             SET rating = $1, review_text = $2
//             WHERE ${type}_id = $3 AND id = $4
//             RETURNING *`;
//         const { rows } = await pool.query(query, [data.rating, data.review_text, id, reviewId]);
//         return rows[0] || null;
//     }

//     async delete(reviewId: string, type: "song" | "album") {
//         try {
//             const result = await pool.query(
//                 `DELETE FROM reviews WHERE id = $1 RETURNING *`,
//                 [reviewId]
//             );
//             return result.rows.length > 0 ? result.rows[0] : null;
//         } catch (err) {
//             throw new Error(`Error deleting review: ${err}`);
//         }
//     }
// }
