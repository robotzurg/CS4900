import { generateId } from '../utils/idGenerator.ts';
import { generateSlug } from '../utils/slugGenerator.ts';
import pool from '../config/db.ts';
import { GenericService } from './genericService.ts';
import type { User } from 'api/models/user.ts';

export class UserService extends GenericService<User> {
  constructor() {
    super('users');
  }

  async getByIdOrDiscordId(id: string): Promise<User | null> {
    try {
      const result = await pool.query(
        `SELECT * FROM users WHERE id = $1 OR discord_user_id = $1`,
        [id]
      );
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (err) {
      throw new Error(`Error retrieving users: ${err}`);
    }
  }
}