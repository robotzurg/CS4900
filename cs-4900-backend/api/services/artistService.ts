import pool from '../config/db.ts';
import { generateId } from '../utils/idGenerator.ts';

export class ArtistService {
  static async getAllArtists(): Promise<any[]> {
    try {
      const result = await pool.query('SELECT * FROM artists');
      return result.rows;
    } catch (err) {
      throw new Error(`Error retrieving artists: ${err}`);
    }
  }

  static async getArtistById(artistId: string): Promise<any | null> {
    try {
      const result = await pool.query('SELECT * FROM artists WHERE artist_id = $1', [artistId]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (err) {
      throw new Error(`Error retrieving artist: ${err}`);
    }
  }

  static async createArtist(artistData: { name: string; image_url: string; bio: string }): Promise<any> {
    try {
      const result = await pool.query(
        `INSERT INTO artists (artist_id, name, image_url, bio) 
         VALUES ($1, $2, $3, $4) RETURNING artist_id`,
        [generateId(), artistData.name, artistData.image_url, artistData.bio]
      );
      return result.rows[0];
    } catch (err) {
      throw new Error(`Error creating artist: ${err}`);
    }
  }

  static async updateArtist(artistId: string, artistData: Partial<{ name: string; image_url: string; bio: string }>): Promise<any | null> {
    try {
      const result = await pool.query(
        `UPDATE artists SET name = $1, image_url = $2, bio = $3 WHERE id = $4 RETURNING *`,
        [artistData.name, artistData.image_url, artistData.bio, artistId]
      );
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (err) {
      throw new Error(`Error updating artist: ${err}`);
    }
  }

  static async deleteArtist(artistId: string): Promise<any | null> {
    try {
      const result = await pool.query('DELETE FROM artists WHERE id = $1 RETURNING *', [artistId]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (err) {
      throw new Error(`Error deleting artist: ${err}`);
    }
  }
}
