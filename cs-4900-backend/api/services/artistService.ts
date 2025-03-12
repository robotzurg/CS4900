import type {Artist} from '../models/artist.ts';
import { GenericService } from './genericService.ts';
import { generateId } from '../utils/idGenerator.ts';
import { generateSlug } from '../utils/slugGenerator.ts';
import pool from '../config/db.ts';

export class ArtistService extends GenericService<Artist> {
  constructor() {
    super('artists');
  }

  async create(artistData: Omit<Artist, 'id'>): Promise<Artist> {
    try {
      const id = generateId();
      const slug = generateSlug(artistData.name);
      let fields: any = Object.keys(artistData);
      let values = Object.values(artistData);
      values.unshift(slug);
      values.unshift(id);
      const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
      fields.unshift('slug');
      fields.unshift('id');
      fields = fields.join(', ');

      const result = await pool.query(
        `INSERT INTO artists (${fields}) VALUES (${placeholders}) RETURNING *`,
        values
      );
      return result.rows[0];
    } catch (err) {
      throw new Error(`Error creating artist: ${err}`);
    }
  }
}
