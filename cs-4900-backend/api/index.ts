import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import pgSession from 'connect-pg-simple';
import pool from '../api/config/db.ts';
import authRouter from './routes/authRoutes.ts';
import albumRouter from './routes/albumRoutes.ts';
import artistRouter from './routes/artistRoutes.ts';
import songRouter from './routes/songRoutes.ts';
import reviewRouter from './routes/reviewsRoutes.ts';
import userRouter from './routes/userRoutes.ts';
import searchRouter from './routes/searchRoutes.ts';

dotenv.config();

const app = express();

const allowedOrigins: string[] = [
  'http://localhost:5173',
  'https://www.waveformreviews.net'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Session middleware with PostgreSQL store
const PgSessionStore = pgSession(session);

app.set('trust proxy', 1);

app.use(session({
  store: new PgSessionStore({
    pool,
    tableName: 'session'
  }),
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    httpOnly: true
  }
}));

app.use((req, res, next) => {
  next();
});


// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport serializeUser and deserializeUser
passport.serializeUser((user: any, done) => {
  done(null, user.id); // Store the user's ID in the session
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (err) { 
    done(err);
  }
});

// Setup routers
app.use('/', authRouter);
app.use('/', albumRouter);
app.use('/', artistRouter);
app.use('/', songRouter);
app.use('/', reviewRouter);
app.use('/', userRouter);
app.use('/', searchRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Ping the render server every 10 minutes
const url = `https://api.waveformreviews.net/`;
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