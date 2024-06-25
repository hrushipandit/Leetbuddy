const express = require('express');
const passport = require('passport');
const router = express.Router();

//Logout Operation
router.get('/logout', (req, res) => {
    if (!req.user) {
        return res.status(400).send('No user currently logged in.');
    }
    req.logout();
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to log out due to server error.');
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});

// Google authentication route
router.get('/auth/google', (req, res, next) => {
    console.log('Attempting to authenticate with Google');
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

// Google authentication callback route
router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('http://localhost:3000');
    });

module.exports = router;