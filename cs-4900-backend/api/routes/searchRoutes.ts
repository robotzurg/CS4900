import express from "express";
import { getSongs, getArtists } from "../controllers/searchController.ts";

const router = express.Router();

router.get("/songs", getSongs);
router.get("/artists", getArtists);

export default router;
