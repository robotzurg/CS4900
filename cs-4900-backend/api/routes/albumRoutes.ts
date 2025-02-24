import pkg from 'express';
import { AlbumService } from '../services/albumService.ts';

const router = pkg.Router();

router.get('/api/albums', async (req: pkg.Request, res: pkg.Response): Promise<any> => {
    try {
        const albums = await AlbumService.getAllAlbums();
        res.json(albums);
    } catch (err) {
        res.status(500).json({ error: `Error retrieving albums: ${err}` });
    }
});

router.get('/api/albums/:albumId', async (req: pkg.Request, res: pkg.Response): Promise<any> => {
    try {
        const album = await AlbumService.getAlbumById(req.params.albumId);
        if (!album) return res.status(404).json({ error: 'Album not found' });
        res.json(album);
    } catch (err) {
        res.status(500).json({ error: `Error retrieving album: ${err}` });
    }
});

router.post('/api/albums', async (req: pkg.Request, res: pkg.Response): Promise<any> => {
    const { id, title, release_date, image_url, spotify_link, spotify_uri, soundcloud_link, apple_link, youtube_link, artist_ids } = req.body;
    
    if (!artist_ids || artist_ids.length === 0) {
        return res.status(400).json({ error: 'At least one artist is required.' });
    }

    try {
        const newAlbum = await AlbumService.createAlbum(
            { title, release_date, image_url, spotify_link, spotify_uri, soundcloud_link, apple_link, youtube_link },
            artist_ids
        );
        res.status(201).json(newAlbum);
    } catch (err) {
        res.status(500).json({ error: `Error creating album: ${err}` });
    }
});

router.put('/api/albums/:albumId', async (req: pkg.Request, res: pkg.Response): Promise<any> => {
    try {
        const updatedAlbum = await AlbumService.updateAlbum(req.params.albumId, req.body);
        if (!updatedAlbum) return res.status(404).json({ error: 'Album not found.' });
        res.json(updatedAlbum);
    } catch (err) {
        res.status(500).json({ error: `Error updating album: ${err}` });
    }
});

router.delete('/api/albums/:albumId', async (req: pkg.Request, res: pkg.Response): Promise<any> => {
    try {
        const deleted = await AlbumService.deleteAlbum(req.params.albumId);
        if (!deleted) return res.status(404).json({ error: 'Album not found.' });
        res.json({ message: 'Album deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: `Error deleting album: ${err}` });
    }
});

export default router;
