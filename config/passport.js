const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const User = require('../models/user-model');
const { login } = require('../controllers/auth');
// const jwt = require('jsonwebtoken');

const callbackURL =
  process.env.NODE_ENV === 'production'
    ? process.env.CALLBACK_URL_PROD
    : process.env.CALLBACK_URL_DEV;

passport.use(
  new GoogleStrategy(
    {
      callbackURL,
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    },
    async (token, tokenSecret, profile, done) => {
      try {
        const { authToken } = await login(profile);
        return done(null, { authToken });
      } catch (err) {
        console.error('Error during authentication:', err.message);
        return done(err, null);
      }
    }
  )
);
