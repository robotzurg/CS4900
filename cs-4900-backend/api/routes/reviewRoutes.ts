import pkg from 'express';
import pool from '../config/db.ts';

const router = pkg.Router();

// POST route to create a review
router.post('/review', async (req: pkg.Request, res: pkg.Response): Promise<any> => {
  const { userId, songId, albumId, review, rating, createdAt } = req.body;

  if (!userId || !review || !rating || !createdAt) {
    return res.status(400).json({ message: 'User ID, review, rating, and timestamp are required.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO reviews (user_id, song_id, album_id, review, rating, created_at) VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5) RETURNING review_id',
      [songId || null, albumId || null, review, rating, createdAt]
    );

    return res.status(201).json({ success: 'Review created successfully', reviewId: result.rows[0].review_id });
  } catch (error) {
    console.error('Error adding review:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET route to fetch a review by ID
router.get('/review/:reviewId', async (req: pkg.Request, res: pkg.Response): Promise<any> => {
  const { reviewId } = req.params;

  try {
    const result = await pool.query(
        `SELECT 
          r.review_id,
          r.user_id, r.song_id, r.album_id, 
          r.review, r.rating, r.created_at
        FROM reviews r
        WHERE r.review_id = $1`,
        [reviewId]
      );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Review not found' });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching review:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
