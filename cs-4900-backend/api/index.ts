import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import albumRouter from './routes/albumRoutes.ts';
import artistRouter from './routes/artistsRoutes.ts';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Setup main routes
app.get('/', async (req, res) => {
  res.send('API v1.0');
});

app.use('/', albumRouter);
app.use('/', artistRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
