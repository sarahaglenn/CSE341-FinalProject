const router = require('express').Router();
const passport = require('passport');

const authController = require('../controllers/auth');

router.get('/login', passport.authenticate('google', { scope: ['profile'] }));

router.get(
  '/google/redirect',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const authToken = req.user;
    res.cookie('authToken', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000
    });

    console.log(authToken);
    res.redirect(`/api-docs?token=${authToken}`);
  }
);

router.get('/logout', authController.logout);

module.exports = router;
