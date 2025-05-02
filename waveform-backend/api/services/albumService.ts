import { GenericService } from './genericService.ts';
import type { Album } from '../models/album.ts';
import pool from '../config/db.ts';
import { generateId } from '../utils/idGenerator.ts';
import { generateSlug } from '../utils/slugGenerator.ts';

export class AlbumService extends GenericService<Album> {
  constructor() {
    super('albums');
  }

  async getAll(filter?: { userId?: string; genreId?: string, artistId?: string }): Promise<Album[]> {
    const conditions: string[] = [];
    const values: any[] = [];

    if (filter?.userId) {
      conditions.push(`r.user_id = $${conditions.length + 1}`);
      values.push(filter.userId);
    }

    if (filter?.genreId) {
      conditions.push(`ga.genre_id = $${conditions.length + 1}`);
      values.push(filter.genreId);
    }

    if (filter?.artistId) {
      conditions.push(`aa.artist_id = $${conditions.length + 1}`);
      values.push(filter.artistId);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
      SELECT 
        a.*, 
        COALESCE(
          json_agg(DISTINCT jsonb_build_object('id', aa.artist_id, 'name', ar.name)) 
          FILTER (WHERE aa.artist_id IS NOT NULL), '[]'
        ) AS artists,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object('id', ga.genre_id, 'name', g.name)) 
          FILTER (WHERE ga.genre_id IS NOT NULL), '[]'
        ) AS genres
      FROM Albums a
      LEFT JOIN Album_Artists aa ON a.id = aa.album_id
      LEFT JOIN Artists ar ON aa.artist_id = ar.id
      LEFT JOIN Album_Genres ga ON a.id = ga.album_id
      LEFT JOIN Genres g ON ga.genre_id = g.id
      LEFT JOIN Reviews r ON a.id = r.album_id
      ${whereClause}
      GROUP BY a.id;
    `;

    const result = await pool.query(query, values);
    return result.rows;
  }
  
  async getById(albumId: string): Promise<Album | null> {
    const query = `
      SELECT a.*, 
        COALESCE(
          json_agg(DISTINCT jsonb_build_object('id', aa.artist_id, 'name', ar.name)) 
          FILTER (WHERE aa.artist_id IS NOT NULL), '[]'
        ) AS artists,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object('id', ga.genre_id, 'name', g.name)) 
          FILTER (WHERE ga.genre_id IS NOT NULL), '[]'
        ) AS genres
      FROM Albums a
      LEFT JOIN Album_Artists aa ON a.id = aa.album_id
      LEFT JOIN Artists ar ON aa.artist_id = ar.id
      LEFT JOIN Album_Genres ga ON a.id = ga.album_id
      LEFT JOIN Genres g ON ga.genre_id = g.id
      WHERE a.id = $1
      GROUP BY a.id;
    `;
    const result = await pool.query(query, [albumId]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }  

  async getByName(albumName: string, artistName?: string): Promise<Album | null> {
    let query = `
      SELECT a.*, 
      COALESCE(
        json_agg(DISTINCT jsonb_build_object('id', aa.artist_id, 'name', ar.name)) 
        FILTER (WHERE aa.artist_id IS NOT NULL), '[]'
      ) AS artists,
      COALESCE(
        json_agg(DISTINCT jsonb_build_object('id', ga.genre_id, 'name', g.name)) 
        FILTER (WHERE ga.genre_id IS NOT NULL), '[]'
      ) AS genres
      FROM Albums a
      LEFT JOIN Album_Artists aa ON a.id = aa.album_id
      LEFT JOIN Artists ar ON aa.artist_id = ar.id
      LEFT JOIN Album_Genres ga ON a.id = ga.album_id
      LEFT JOIN Genres g ON ga.genre_id = g.id
      WHERE a.name ILIKE $1
    `;
    const params: any[] = [`%${albumName}%`];

    if (artistName) {
      query += ` AND ar.name ILIKE $2`;
      params.push(`%${artistName}%`);
    }

    query += ` GROUP BY a.id;`;

    const result = await pool.query(query, params);
    return result.rows[0] ?? null;
  }

  async create(albumData: Omit<Album, 'id'>, artistIds: string[] = [], genreIds: string[] = []): Promise<Album> {
    const client = await pool.connect();
    try {

      // Check if artist IDs are provided
      if (artistIds.length == 0) throw "No artist IDs provided.";

      await client.query('BEGIN');
      const id = generateId();
      const slug = generateSlug(albumData.name);

      // Insert the album into the Albums table
      const insertAlbumQuery = `
        INSERT INTO Albums (id, name, release_date, slug, image_url, spotify_url, spotify_uri, soundcloud_url, apple_url, youtube_url) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id;
      `;
      await client.query(insertAlbumQuery, [
        id, albumData.name, albumData.release_date, slug, albumData.image_url,
        albumData.spotify_url, albumData.spotify_uri, albumData.soundcloud_url,
        albumData.apple_url, albumData.youtube_url
      ]);

      // Insert album-artist relationships
      const artistQueries = artistIds.map(artistId =>
        client.query(`INSERT INTO Album_Artists (album_id, artist_id) VALUES ($1, $2)`, [id, artistId])
      );

      await Promise.all(artistQueries);

      // Insert album-genre relationships
      const genreQueries = genreIds.map(genreId =>
        client.query(`INSERT INTO Song_Genres (song_id, genre_id) VALUES ($1, $2)`, [id, genreId])
      );

      await Promise.all(genreQueries);

      await client.query('COMMIT');
      return { ...albumData, id: id };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}