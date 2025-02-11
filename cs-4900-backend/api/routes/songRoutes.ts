import pkg from 'express';
import pool from '../config/db.ts';

const router = pkg.Router();

// POST route to create a song
router.post('/song', async (req: pkg.Request, res: pkg.Response): Promise<any> => {
  const { title, artist, albumId, releaseDate, genre } = req.body;

  if (!title || !artist || !releaseDate || !genre) {
    return res.status(400).json({ message: 'Title, artist, releaseDate, and genre are required.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO songs (song_id, title, artist, album_id, release_date, genre) VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5) RETURNING song_id',
      [title, artist, albumId || null, releaseDate, genre]
    );

    return res.status(201).json({ success: 'Song added successfully', songId: result.rows[0].song_id });
  } catch (error) {
    console.error('Error adding song:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET route to fetch a song by ID
router.get('/song/:songId', async (req: pkg.Request, res: pkg.Response): Promise<any> => {
  const { songId } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
        s.song_id, s.title, s.artist, 
        COALESCE(a.title, NULL) AS album, 
        s.release_date, s.genre, 
        COALESCE(AVG(r.rating), 0) AS average_rating 
      FROM songs s 
      LEFT JOIN albums a ON s.album_id = a.album_id
      LEFT JOIN reviews r ON s.song_id = r.song_id
      WHERE s.song_id = $1
      GROUP BY s.song_id, a.title`,
      [songId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Song not found' });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching song:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
