import pkg from 'express';
import { searchSongs, searchArtists, searchAll } from "../services/searchService.ts";

export const getAll = async (req: pkg.Request, res: pkg.Response) => {
    try {
        const query = req.query.q as string;
        const songs = await searchAll(query);
        res.json(songs);
    } catch (error) {
        console.error("Error fetching music:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const getSongs = async (req: pkg.Request, res: pkg.Response) => {
    try {
        const query = req.query.q as string;
        const songs = await searchSongs(query);
        res.json(songs);
    } catch (error) {
        console.error("Error fetching songs:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const getArtists = async (req: pkg.Request, res: pkg.Response) => {
    try {
        const query = req.query.q as string;
        const artists = await searchArtists(query);
        res.json(artists);
    } catch (error) {
        console.error("Error fetching artists:", error);
        res.status(500).json({ error: "Server error" });
    }
};
