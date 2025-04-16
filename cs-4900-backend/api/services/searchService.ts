import pool from "../config/db.ts";

export const searchAll = async (query: string): Promise<{ id: string; name: string }[]> => {
    if (!query) return [];
    const { rows } = await pool.query(
        `
        SELECT id, name AS name, category, 'song' AS type FROM songs WHERE name ILIKE $1
        UNION
        SELECT id, name AS name, category, 'album' AS type FROM albums WHERE name ILIKE $1
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

export const searchArtists = async (query: string): Promise<{ id: string; name: string }[]> => {
    if (!query) return [];
    const { rows } = await pool.query(
        "SELECT id, name FROM artists WHERE name ILIKE $1 LIMIT 10",
        [`%${query}%`]
    );
    return rows;
};


export const searchAlbums = async (query: string): Promise<{ id: string; name: string }[]> => {
    if (!query) return [];
    const { rows } = await pool.query(
        "SELECT id, name FROM albums WHERE name ILIKE $1 LIMIT 10",
        [`%${query}%`]
    );
    return rows;
};

export const searchUsers = async (query: string): Promise<{ id: string; username: string }[]> => {
    if (!query) return [];
    const { rows } = await pool.query(
        "SELECT id, username FROM users WHERE username ILIKE $1 LIMIT 10",
        [`%${query}%`]
    );
    return rows;
};
