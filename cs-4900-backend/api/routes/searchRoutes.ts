import express from "express";
import { getSongs, getArtists, getAll } from "../controllers/searchController.ts";

const router = express.Router();

router.get("/api/search", getAll);
router.get("/api/search/songs", getSongs);
router.get("/api/search/artists", getArtists);

export default router;
