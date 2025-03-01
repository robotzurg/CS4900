import pool from "../config/db.ts";

export const searchSongs = async (query: string): Promise<{ id: string; title: string }[]> => {
    if (!query) return [];
    const { rows } = await pool.query(
        "SELECT id, name FROM songs WHERE name ILIKE $1 LIMIT 10",
        [`%${query}%`]
    );
    return rows;
};

export const searchArtists = async (query: string): Promise<{ id: string; name: string }[]> => {
    if (!query) return [];
    const { rows } = await pool.query(
        "SELECT id, name FROM artists WHERE name ILIKE $1 LIMIT 10",
        [`%${query}%`]
    );
    return rows;
};
