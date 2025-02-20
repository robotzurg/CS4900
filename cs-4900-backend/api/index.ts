import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "@vercel/node";
import albumRouter from "../src/routes/albumRoutes.ts";
import artistRouter from "../src/routes/artistsRoutes.ts";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root API response
app.get("/", (req, res) => {
  res.send("API v1.0");
});

// Register routes
app.use("/api/albums", albumRouter);
app.use("/api/artists", artistRouter);

// Export Express handler for Vercel
export default (req: pkg.VercelRequest, res: pkg.VercelResponse) => {
  return app(req, res);
};

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));