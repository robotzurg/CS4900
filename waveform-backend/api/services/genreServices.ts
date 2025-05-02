import type { Genre } from 'api/models/genre.ts';
import { GenericService } from './genericService.ts';
import pool from '../config/db.ts';

export class GenreService extends GenericService<Genre> {
  constructor() {
    super('genres');
  }

  async create(data: Partial<Genre>, songIds: string[] = [], albumIds: string[] = []): Promise<Genre> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const genre = await super.create(data);

      // Add genre to songs
      if (songIds.length > 0) {
        const songQueries = songIds.map((songId) =>
          client.query(
            `INSERT INTO Song_Genres (song_id, genre_id) VALUES ($1, $2)`,
            [songId, genre.id]
          )
        );
        await Promise.all(songQueries);
      }

      // Add genre to albums
      if (albumIds.length > 0) {
        const albumQueries = albumIds.map((albumId) =>
          client.query(
            `INSERT INTO Album_Genres (album_id, genre_id) VALUES ($1, $2)`,
            [albumId, genre.id]
          )
        );
        await Promise.all(albumQueries);
      }

      await client.query('COMMIT');
      return genre;
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Error creating genre and linking to songs/albums: ${error}`);
    } finally {
      client.release();
    }
  }
}
