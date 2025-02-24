import { GenericService } from './genericService.ts';
import type { Album } from '../models/album.ts';
import pool from '../config/db.ts';
import { generateId } from '../utils/idGenerator.ts';

export class AlbumService extends GenericService<Album> {
  constructor() {
    super('albums');
  }

  async getAll(): Promise<Album[]> {
    const query = `
      SELECT a.*, 
        COALESCE(json_agg(DISTINCT aa.artist_id) FILTER (WHERE aa.artist_id IS NOT NULL), '[]') AS artist_ids,
        COALESCE(json_agg(DISTINCT ga.genre_id) FILTER (WHERE ga.genre_id IS NOT NULL), '[]') AS genre_ids
      FROM Albums a
      LEFT JOIN Album_Artists aa ON a.id = aa.album_id
      LEFT JOIN Album_Genres ga ON a.id = ga.album_id
      GROUP BY a.id;
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  async getById(albumId: string): Promise<Album | null> {
    const query = `
      SELECT a.*, 
        COALESCE(json_agg(DISTINCT aa.artist_id) FILTER (WHERE aa.album_id IS NOT NULL), '[]') AS artist_ids,
        COALESCE(json_agg(DISTINCT ga.genre_id) FILTER (WHERE ga.album_id IS NOT NULL), '[]') AS genre_ids
      FROM Albums a
      LEFT JOIN Album_Artists aa ON a.id = aa.album_id
      LEFT JOIN Album_Genres ga ON a.id = ga.album_id
      WHERE a.id = $1
      GROUP BY a.id;
    `;
    const result = await pool.query(query, [albumId]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async create(albumData: Omit<Album, 'id'>, artistIds: string[] = []): Promise<Album> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Insert the album into the Albums table
      const insertAlbumQuery = `
        INSERT INTO Albums (id, title, release_date, image_url, spotify_link, spotify_uri, soundcloud_link, apple_link, youtube_link) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id;
      `;
      const { rows } = await client.query(insertAlbumQuery, [
        generateId(), albumData.title, albumData.release_date, albumData.image_url,
        albumData.spotify_link, albumData.spotify_uri, albumData.soundcloud_link,
        albumData.apple_link, albumData.youtube_link
      ]);

      const albumId = rows[0].album_id;

      // Insert album-artist relationships
      const artistQueries = artistIds.map(artistId =>
        client.query(`INSERT INTO Album_Artists (album_id, artist_id) VALUES ($1, $2)`, [albumId, artistId])
      );

      await Promise.all(artistQueries);

      await client.query('COMMIT');
      return { ...albumData, id: albumId };
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Error creating album: ${error}`);
    } finally {
      client.release();
    }
  }
}