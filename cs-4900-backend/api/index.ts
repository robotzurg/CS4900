const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require('dotenv').config({ path: '.env.development.local' });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Test API route
app.get("/api-version", (req, res) => res.send("API v1.0"));

// Add a comment
app.post("/comments", async (req, res) => {
  const { comment } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO comments (comment) VALUES ($1) RETURNING *",
      [comment]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Failed to add comment" });
  }
});

// Get all comments
app.get("/comments", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM comments ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// Get stats for Waveform bot (useful for the discord bot)
app.get("/bot-stats", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM global_statistics LIMIT 1");
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
