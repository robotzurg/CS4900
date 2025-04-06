import express from "express";
import { getSongs, getArtists, getAlbums, getAll } from "../controllers/searchController.ts";

const router = express.Router();

router.get("/api/search", getAll);
router.get("/api/search/songs", getSongs);
router.get("/api/search/albums", getAlbums);
router.get("/api/search/artists", getArtists);

export default router;
