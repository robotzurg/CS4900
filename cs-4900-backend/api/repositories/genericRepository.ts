import { Client, QueryResult } from 'pg';

export class GenericRepository<T extends { id: number }> {
  constructor(protected client: Client, protected tableName: string) { }

  async create(item: Omit<T, 'id'>): Promise<T> {
    const columns = Object.keys(item).join(', ');
    const values = Object.values(item);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
    const query = `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders}) RETURNING *`;
    const result: QueryResult<T> = await this.client.query(query, values);
    return result.rows[0];
  }

  async getById(id: string): Promise<T | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1`;
    const result: QueryResult<T> = await this.client.query(query, [id]);
    return result.rows[0] || null;
  }

  async getAll(): Promise<T[]> {
    const query = `SELECT * FROM ${this.tableName}`;
    const result: QueryResult<T> = await this.client.query(query);
    return result.rows;
  }

  async update(id: string, item: Partial<Omit<T, 'id'>>): Promise<T | null> {
    const updates = Object.keys(item)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ');
    const values = Object.values(item);
    const query = `UPDATE ${this.tableName} SET ${updates} WHERE id = $${values.length + 1} RETURNING *`;
    const result: QueryResult<T> = await this.client.query(query, [...values, id]);
    return result.rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const query = `DELETE FROM ${this.tableName} WHERE id = $1`;
    const result: QueryResult<T> = await this.client.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }  
}
