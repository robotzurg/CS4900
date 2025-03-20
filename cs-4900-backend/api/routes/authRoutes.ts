import pkg from 'express';
import pool from '../config/db.ts';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { generateId } from '../utils/idGenerator.ts'; 

const router = pkg.Router();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.IS_DEV === 'true' ? `${process.env.DEV_API_URL}` : `${process.env.MAIN_API_URL}`}/oauth2/redirect/google`,
      scope: ['profile'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        const { rows } = await pool.query(
          'SELECT * FROM federated_credentials WHERE provider = $1 AND subject = $2',
          ['google', profile.id]
        );

        console.log(profile);

        if (rows.length > 0) {
          // User exists, fetch their info
          const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [rows[0].user_id]);
          return done(null, userResult.rows[0]);
        }

        // New user, insert into database
        const newUserId = generateId();
        await pool.query('INSERT INTO users (id, username) VALUES ($1, $2)', [newUserId, profile.displayName]);

        // Link federated credentials
        await pool.query(
          'INSERT INTO federated_credentials (user_id, provider, subject) VALUES ($1, $2, $3)',
          [newUserId, 'google', profile.id]
        );

        return done(null, { id: newUserId, username: profile.displayName });
      } catch (err) {
        console.log(err);
        return done(err);
      }
    }
  )
);

// **Login route**
router.get('/login/federated/google', passport.authenticate('google'));

// **Logout route**
router.get('/logout', (req, res) => {
  // Logout user from passport session
  req.logout((err) => {
    if (err) {
      return res.status(500).send('Failed to log out');
    }

    // Destroy session
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send('Failed to destroy session');
      }

      // Send response after session is destroyed
      res.clearCookie('connect.sid');
      res.redirect(process.env.IS_DEV === 'true' ? `${process.env.DEV_FRONT_URL}` : `${process.env.MAIN_FRONT_URL}`);
    });

    return "success"
  });
});

// **Google OAuth callback**
router.get(
  '/oauth2/redirect/google',
  passport.authenticate('google', { 
    failureRedirect: process.env.IS_DEV === 'true' ? `${process.env.DEV_FRONT_URL}login` : `${process.env.MAIN_FRONT_URL}login`
  }),
  (req, res) => {
    res.redirect(process.env.IS_DEV === 'true' ? `${process.env.DEV_FRONT_URL}` : `${process.env.MAIN_FRONT_URL}`);
  }
);

router.get('/api/me', (req, res) => {
  if (req.isAuthenticated()) { 
    res.json(req.user); 
  } else {
    res.status(401).json({ error: 'Not logged in' }); 
  }
});

export default router;
