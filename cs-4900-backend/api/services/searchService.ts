import pool from "../config/db.ts";

export const searchAll = async (query: string): Promise<{ id: string; name: string }[]> => {
    if (!query) return [];
    const { rows } = await pool.query(
        `
        SELECT id, name AS name, song_type, 'song' AS type FROM songs WHERE name ILIKE $1
        UNION
        SELECT id, name AS name, album_type, 'album' AS type FROM albums WHERE name ILIKE $1
        LIMIT 10
        `,
        [`%${query}%`]
    );
    return rows;
};


export const searchSongs = async (query: string): Promise<{ id: string; name: string }[]> => {
    if (!query) return [];
    const { rows } = await pool.query(
        "SELECT id, name FROM songs WHERE name ILIKE $1 LIMIT 10",
        [`%${query}%`]
    );
    return rows;
};

export const searchArtists = async (query: string): Promise<{ id: string; namnamee: string }[]> => {
    if (!query) return [];
    const { rows } = await pool.query(
        "SELECT id, name FROM artists WHERE name ILIKE $1 LIMIT 10",
        [`%${query}%`]
    );
    return rows;
};
