import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import pool from '../api/config/db.ts';
import authRouter from './routes/authRoutes.ts';
import albumRouter from './routes/albumRoutes.ts';
import artistRouter from './routes/artistsRoutes.ts';
import songRouter from './routes/songRoutes.ts';
import reviewRouter from './routes/reviewsRoutes.ts';
dotenv.config();

const app = express();

const allowedOrigins: string[] = [
  'http://localhost:5173',
  'https://waveform-reviews.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      console.log(origin, allowedOrigins);
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));


app.use(express.json());

// Setup main routes
app.get('/', async (req, res) => {
  res.send('API v1.0');
});

// Session middleware (required for passport)
app.use(session({
  secret: process.env.SESSION_SECRET as string, // Type assertion to avoid undefined error
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    sameSite: false
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport serializeUser and deserializeUser
passport.serializeUser((user: any, done) => {
  console.log(user, 'SERIALIZE USER OUTPUT');
  done(null, user.id); // Store the user's ID in the session
});

passport.deserializeUser(async (id: string, done) => {
  try {
    // Fetch the user based on the id from your database
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    console.log('START USER');
    console.log(result.rows[0]);
    console.log('END USER');
    done(null, result.rows[0]); // Attach the user object to the session
  } catch (err) { 
    console.log(`ERROR FROM DESERIALIZE: ${err}`);
    done(err);
  }
});

app.use('/', authRouter);
app.use('/', albumRouter);
app.use('/', artistRouter);
app.use('/', songRouter);
app.use('/', reviewRouter);

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