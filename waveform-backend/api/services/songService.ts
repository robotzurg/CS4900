import { GenericService } from './genericService.ts';
import type { Song } from '../models/song.ts';
import pool from '../config/db.ts';
import { generateId } from '../utils/idGenerator.ts';
import { generateSlug } from '../utils/slugGenerator.ts';

export class SongService extends GenericService<Song> {
  constructor() {
    super('songs');
  }

  async getAll(filter?: { userId?: string; genreId?: string, artistId?: string }): Promise<Song[]> {
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
      FROM Songs a
      LEFT JOIN Song_Artists aa ON a.id = aa.song_id
      LEFT JOIN Artists ar ON aa.artist_id = ar.id
      LEFT JOIN Song_Genres ga ON a.id = ga.song_id
      LEFT JOIN Genres g ON ga.genre_id = g.id
      LEFT JOIN Reviews r ON a.id = r.song_id
      ${whereClause}
      GROUP BY a.id;
    `;

    const result = await pool.query(query, values);
    return result.rows;
  }

  async getById(songId: string): Promise<Song | null> {
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
      FROM Songs a
      LEFT JOIN Song_Artists aa ON a.id = aa.song_id
      LEFT JOIN Artists ar ON aa.artist_id = ar.id
      LEFT JOIN Song_Genres ga ON a.id = ga.song_id
      LEFT JOIN Genres g ON ga.genre_id = g.id
      WHERE a.id = $1
      GROUP BY a.id;
    `;
    const result = await pool.query(query, [songId]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async getByName(songName: string, artistName?: string): Promise<Song | null> {
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
      FROM Songs a
      LEFT JOIN Song_Artists aa ON a.id = aa.song_id
      LEFT JOIN Artists ar ON aa.artist_id = ar.id
      LEFT JOIN Song_Genres ga ON a.id = ga.song_id
      LEFT JOIN Genres g ON ga.genre_id = g.id
      WHERE a.name ILIKE $1
    `;
    const params: any[] = [`%${songName}%`];

    if (artistName) {
      query += ` AND ar.name ILIKE $2`;
      params.push(`%${artistName}%`);
    }

    query += ` GROUP BY a.id;`;

    const result = await pool.query(query, params);
    return result.rows[0] ?? null;
  }

  async create(songData: Omit<Song, 'id'>, artistIds: string[] = [], albumIds: string[] = [], genreIds: string[] = []): Promise<Song> {
    const client = await pool.connect();
    try {

      // Check if artist IDs are provided
      if (artistIds.length == 0) throw 'No artist IDs provided.';

      await client.query('BEGIN');
      const id = generateId();
      const slug = generateSlug(songData.name);

      // Insert the song into the Songs table
      const insertSongQuery = `
        INSERT INTO Songs (id, name, release_date, slug, image_url, spotify_url, spotify_uri, soundcloud_url, apple_url, youtube_url) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id;
      `;
      const { rows } = await client.query(insertSongQuery, [
        id, songData.name, songData.release_date, slug, songData.image_url,
        songData.spotify_url, songData.spotify_uri, songData.soundcloud_url,
        songData.apple_url, songData.youtube_url
      ]);

      // Insert song-artist relationships
      const artistQueries = artistIds.map(artistId =>
        client.query(`INSERT INTO Song_Artists (song_id, artist_id) VALUES ($1, $2)`, [id, artistId])
      );

      await Promise.all(artistQueries);

      // Insert song-album relationships
      const albumQueries = albumIds.map(albumId =>
        client.query(`INSERT INTO Song_Albums (song_id, album_id) VALUES ($1, $2)`, [id, albumId])
      );

      await Promise.all(albumQueries);

      // Insert song-genre relationships
      const genreQueries = genreIds.map(genreId =>
        client.query(`INSERT INTO Song_Genres (song_id, genre_id) VALUES ($1, $2)`, [id, genreId])
      );

      await Promise.all(genreQueries);

      await client.query('COMMIT');
      return { ...songData, id: id };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
