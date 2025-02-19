import pkg from 'express';
import pool from '../config/db.ts';

const router = pkg.Router();

// GET route to get all albums
router.get('/api/albums', async (req: pkg.Request, res: pkg.Response): Promise<any> => {
    try {
        const result = await pool.query('SELECT * FROM Albums');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: `Error retrieving albums: ${err}` });
    }
});

// GET route to get a specific album
router.get('/api/albums/:albumId', async (req: pkg.Request, res: pkg.Response): Promise<any> => {
    const { albumId } = req.params;
    try {
        const result = await pool.query('SELECT * FROM Albums WHERE album_id = $1', [albumId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Album not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: `Error retrieving album: ${err}` });
    }
});

// POST route to create a new album
router.post('/api/albums', async (req: pkg.Request, res: pkg.Response): Promise<any> => {
    const { title, release_date, image_url, spotify_link, spotify_uri, soundcloud_link, apple_link, youtube_link, artist_ids } = req.body;

    if (!artist_ids || artist_ids.length === 0) {
        return res.status(400).json({ error: 'At least one artist is required.' });
    }

    // Get a client from the pool
    const client = await pool.connect(); 

    try {
        // Start transaction, allows me to roll back later
        await client.query('BEGIN'); 

        // Insert album and return album_id
        const albumResult = await client.query(
            `INSERT INTO Albums (title, release_date, image_url, spotify_link, spotify_uri, 
            soundcloud_link, apple_link, youtube_link) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING album_id`,
            [title, release_date, image_url, spotify_link, spotify_uri, soundcloud_link, apple_link, youtube_link]
        );

        const album_id = albumResult.rows[0].album_id;

        // Insert into Music_Artists table
        const artistQueries = artist_ids.map((artist_id: any) => {
            return client.query(
                `INSERT INTO Album_Artists (album_id, artist_id) VALUES ($1, $2)`,
                [album_id, artist_id]
            );
        });

        await Promise.all(artistQueries); 

        await client.query('COMMIT'); // Commit transaction

        res.status(201).json({ album_id, title, release_date });
    } catch (err) {
        await client.query('ROLLBACK'); // Rollback if any query fails
        console.error('Error creating album:', err);
        res.status(500).json({ error: `Error creating album: ${err}` });
    } finally {
        client.release(); // Release client back to the pool
    }
});


// PUT route to edit an album
router.put('/api/albums/:albumId', async (req: pkg.Request, res: pkg.Response): Promise<any> => {
    const { albumId } = req.params;
    const { title, release_date, image_url, spotify_link, spotify_uri, soundcloud_link, apple_link, youtube_link } = req.body;
    try {
        const result = await pool.query(
            'UPDATE Albums SET title = $1, release_date = $2, image_url = $3, spotify_link = $4 WHERE album_id = $5 RETURNING *',
            [title, release_date, image_url, spotify_link, albumId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Album not found.' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: `Error updating album: ${err}` });
    }
});

// DELETE route to delete an album
router.delete('/api/albums/:albumId', async (req: pkg.Request, res: pkg.Response): Promise<any> => {
    const { albumId } = req.params;
    try {
        const result = await pool.query('DELETE FROM Albums WHERE album_id = $1 RETURNING *', [albumId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Album not found' });
        }
        res.json({ message: 'Album deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: `Error deleting album: ${err}` });
    }
});

export default router;
