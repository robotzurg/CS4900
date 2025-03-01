import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import albumRouter from './routes/albumRoutes.ts';
import artistRouter from './routes/artistsRoutes.ts';
import songRouter from './routes/songRoutes.ts';
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
app.use('/', songRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Ping the render server every 10 minutes, because otherwise it goes down for inactivity.
const url = `https://cs4900-637g.onrender.com/`;
const interval = 10 * 60000; 

function reloadWebsite() {
  fetch(url)
    .then(response => {
      //console.log(`Reloaded at ${new Date().toISOString()}: Status Code ${response.status}`);
    })
    .catch(error => {
      console.error(`Error reloading at ${new Date().toISOString()}:`, error.message);
    });
}

setInterval(reloadWebsite, interval);