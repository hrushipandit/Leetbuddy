const express = require('express');
const passport = require('passport');
const router = express.Router();

//Logout Operation
router.get('/logout', (req, res) => {
    if (!req.user) {
        return res.status(400).send('No user currently logged in.');
    }
    req.logout((err) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Failed to log out.');
        }
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Failed to destroy session.');
            }
            res.clearCookie('connect.sid');
    //        res.redirect('/');  // Consider redirecting to a server-side route that handles GET '/'
            console.log("logout successful");
        });
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




router.get('/auth/login/status', (req, res) => {
    if (req.isAuthenticated()) {  // Passport provides this method to check authentication status
        res.json({ isLoggedIn: true, user: req.user }); // Optionally, send user data
    } else {
        res.json({ isLoggedIn: false });
    }
});

module.exports = router;