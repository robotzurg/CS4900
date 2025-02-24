import { GenericService } from './genericService.ts';
import type { Song } from '../models/song.ts';
import pool from '../config/db.ts';
import { generateId } from '../utils/idGenerator.ts';

export class SongService extends GenericService<Song> {
  constructor() {
    super('songs');
  }

  async getAll(): Promise<Song[]> {
    const query = `
      SELECT a.*, 
        COALESCE(json_agg(DISTINCT aa.artist_id) FILTER (WHERE aa.artist_id IS NOT NULL), '[]') AS artist_ids,
        COALESCE(json_agg(DISTINCT ga.genre_id) FILTER (WHERE ga.genre_id IS NOT NULL), '[]') AS genre_ids
      FROM Songs a
      LEFT JOIN Song_Artists aa ON a.id = aa.song_id
      LEFT JOIN Song_Genres ga ON a.id = ga.song_id
      GROUP BY a.id;
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  async getById(songId: string): Promise<Song | null> {
    const query = `
      SELECT a.*, 
        COALESCE(json_agg(DISTINCT aa.artist_id) FILTER (WHERE aa.song_id IS NOT NULL), '[]') AS artist_ids,
        COALESCE(json_agg(DISTINCT ga.genre_id) FILTER (WHERE ga.song_id IS NOT NULL), '[]') AS genre_ids
      FROM Songs a
      LEFT JOIN Song_Artists aa ON a.id = aa.song_id
      LEFT JOIN Song_Genres ga ON a.id = ga.song_id
      WHERE a.id = $1
      GROUP BY a.id;
    `;
    const result = await pool.query(query, [songId]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async create(songData: Omit<Song, 'id'>, artistIds: string[] = [], albumIds: string[] = []): Promise<Song> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Insert the song into the Songs table
      const insertSongQuery = `
        INSERT INTO Songs (id, title, release_date, image_url, spotify_link, spotify_uri, soundcloud_link, apple_link, youtube_link) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id;
      `;
      const { rows } = await client.query(insertSongQuery, [
        generateId(), songData.title, songData.release_date, songData.image_url,
        songData.spotify_link, songData.spotify_uri, songData.soundcloud_link,
        songData.apple_link, songData.youtube_link
      ]);

      const songId = rows[0].song_id;

      // Insert song-artist relationships
      const artistQueries = artistIds.map(artistId =>
        client.query(`INSERT INTO Song_Artists (song_id, artist_id) VALUES ($1, $2)`, [songId, artistId])
      );

      await Promise.all(artistQueries);

      // Insert song-album relationships
      const albumQueries = albumIds.map(albumId =>
        client.query(`INSERT INTO Song_Albums (song_id, album_id) VALUES ($1, $2)`, [songId, albumId])
      );

      await Promise.all(artistQueries);

      await client.query('COMMIT');
      return { ...songData, id: songId };
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Error creating song: ${error}`);
    } finally {
      client.release();
    }
  }
}
