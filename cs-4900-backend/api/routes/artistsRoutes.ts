import pkg from 'express';
import pool from '../config/db.ts';

const router = pkg.Router();

// GET route to get all artists
router.get('/api/artists', async (req: pkg.Request, res: pkg.Response): Promise<any> => {
    try {
        const result = await pool.query('SELECT * FROM artists');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: `Error retrieving artists: ${err}` });
    }
});

// GET route to get a specific artist
router.get('/api/artists/:artistId', async (req: pkg.Request, res: pkg.Response): Promise<any> => {
    const { artistId } = req.params;
    try {
        const result = await pool.query('SELECT * FROM artists WHERE artist_id = $1', [artistId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'artist not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: `Error retrieving artist: ${err}` });
    }
});

// POST route to create a new artist
router.post('/api/artists', async (req: pkg.Request, res: pkg.Response): Promise<any> => {
    const { name, image_url, bio } = req.body;

    try {
        // Insert artist and return artist_id
        const result = await pool.query(
            `INSERT INTO artists (name, image_url, bio) 
            VALUES ($1, $2, $3) RETURNING artist_id`,
            [name, image_url, bio]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: `Error creating artist: ${err}` });
    }
});


// PUT route to edit an artist
router.put('/api/artists/:artistId', async (req: pkg.Request, res: pkg.Response): Promise<any> => {
    const { artistId } = req.params;
    const { name, image_url, bio } = req.body;
    try {
        const result = await pool.query(
            'UPDATE artists SET name = $1, image_url = $2, bio = $3 WHERE artist_id = $4 RETURNING *',
            [name, image_url, bio, artistId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Artist not found.' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: `Error updating artist: ${err}` });
    }
});

// DELETE route to delete an artist
router.delete('/api/artists/:artistId', async (req: pkg.Request, res: pkg.Response): Promise<any> => {
    const { artistId } = req.params;
    try {
        const result = await pool.query('DELETE FROM artists WHERE artist_id = $1 RETURNING *', [artistId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Artist not found' });
        }
        res.json({ message: 'artist deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: `Error deleting artist: ${err}` });
    }
});

export default router;
