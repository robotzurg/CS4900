import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import artistRouter from './routes/artistsRoutes.ts';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/', artistRouter);

app.get('/', async (req, res) => {
  res.send('API v1.0');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
