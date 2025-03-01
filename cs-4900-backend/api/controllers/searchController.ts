import { Request, Response } from "express";
import { searchSongs, searchArtists } from "../services/searchService.ts";

export const getSongs = async (req: Request, res: Response) => {
    try {
        const query = req.query.query as string;
        const songs = await searchSongs(query);
        res.json(songs);
    } catch (error) {
        console.error("Error fetching songs:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const getArtists = async (req: Request, res: Response) => {
    try {
        const query = req.query.query as string;
        const artists = await searchArtists(query);
        res.json(artists);
    } catch (error) {
        console.error("Error fetching artists:", error);
        res.status(500).json({ error: "Server error" });
    }
};
