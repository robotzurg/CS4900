import { GenericService } from './genericService.ts';
import type { Song } from '../models/song.ts';
import pool from '../config/db.ts';
import { generateId } from '../utils/idGenerator.ts';
import { generateSlug } from '../utils/slugGenerator.ts';

export class SongService extends GenericService<Song> {
  constructor() {
    super('songs');
  }

  async getAll(): Promise<Song[]> {
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
      GROUP BY a.id;
    `;
    const result = await pool.query(query);
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

  async getBySlug(slug: string): Promise<Song | null> {
    const query = `
      SELECT s.*, 
        COALESCE(
          json_agg(DISTINCT jsonb_build_object('id', aa.artist_id, 'name', ar.name)) 
          FILTER (WHERE aa.artist_id IS NOT NULL), '[]'
        ) AS artists,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object('id', ga.genre_id, 'name', g.name)) 
          FILTER (WHERE ga.genre_id IS NOT NULL), '[]'
        ) AS genres
      FROM Songs s
      LEFT JOIN Song_Artists aa ON s.id = aa.song_id
      LEFT JOIN Artists ar ON aa.artist_id = ar.id
      LEFT JOIN Song_Genres ga ON s.id = ga.song_id
      LEFT JOIN Genres g ON ga.genre_id = g.id
      WHERE s.slug = $1
      GROUP BY s.id;
    `;
    const result = await pool.query(query, [slug]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async create(songData: Omit<Song, 'id'>, artistIds: string[] = [], albumIds: string[] = []): Promise<Song> {
    const client = await pool.connect();
    try {

      // Check if artist IDs are provided
      if (artistIds.length == 0) throw 'No artist IDs provided.';

      await client.query('BEGIN');
      const id = generateId();
      const slug = generateSlug(songData.name);

      // Insert the song into the Songs table
      const insertSongQuery = `
        INSERT INTO Songs (id, name, release_date, slug, image_url, spotify_link, spotify_uri, soundcloud_link, apple_link, youtube_link) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id;
      `;
      const { rows } = await client.query(insertSongQuery, [
        id, songData.name, songData.release_date, slug, songData.image_url,
        songData.spotify_link, songData.spotify_uri, songData.soundcloud_link,
        songData.apple_link, songData.youtube_link
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
