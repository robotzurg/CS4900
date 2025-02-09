import pkg from 'express';
import pool from '../config/db.ts';

const router = pkg.Router();

// POST route for creating an artist
router.post('/artists', async (req: pkg.Request, res: pkg.Response): Promise<any> => {
  const { name, bio } = req.body;

  if (!name || !bio) {
    return res.status(400).json({ message: 'Name and bio are required.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO artists (artist_id, name, bio) VALUES (uuid_generate_v4(), $1, $2) RETURNING *',
      [name, bio]
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating artist:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET route for fetching all artists
router.get('/artists', async (req: pkg.Request, res: pkg.Response): Promise<any> => {
  try {
    const result = await pool.query('SELECT * FROM artists');
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching artists:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;