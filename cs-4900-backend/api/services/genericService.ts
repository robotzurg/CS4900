import pool from '../config/db.ts';
import { generateId } from '../utils/idGenerator.ts';

export class GenericService<T> {
  private tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async getAll(): Promise<T[]> {
    try {
      const result = await pool.query(`SELECT * FROM ${this.tableName}`);
      return result.rows;
    } catch (err) {
      throw new Error(`Error retrieving ${this.tableName}: ${err}`);
    }
  }

  async getById(id: string): Promise<T | null> {
    try {
      const result = await pool.query(
        `SELECT * FROM ${this.tableName} WHERE id = $1`,
        [id]
      );
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (err) {
      throw new Error(`Error retrieving ${this.tableName}: ${err}`);
    }
  }

  async create(data: Partial<T>): Promise<T> {
    try {
      let fields: any = Object.keys(data);
      const values = Object.values(data);
      const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
      const id = generateId();
      fields.unshift(id);
      fields = fields.join(', ');
      
      const result = await pool.query(
        `INSERT INTO ${this.tableName} (${fields}) VALUES (${placeholders}) RETURNING *`,
        values
      );
      return result.rows[0];
    } catch (err) {
      throw new Error(`Error creating ${this.tableName}: ${err}`);
    }
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    try {
      const setClause = Object.keys(data)
        .map((key, index) => `${key} = $${index + 2}`)
        .join(', ');
      const values = [id, ...Object.values(data)];

      const result = await pool.query(
        `UPDATE ${this.tableName} SET ${setClause} WHERE id = $1 RETURNING *`,
        values
      );
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (err) {
      throw new Error(`Error updating ${this.tableName}: ${err}`);
    }
  }

  async delete(id: string): Promise<T | null> {
    try {
      const result = await pool.query(
        `DELETE FROM ${this.tableName} WHERE id = $1 RETURNING *`,
        [id]
      );
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (err) {
      throw new Error(`Error deleting ${this.tableName}: ${err}`);
    }
  }
}
