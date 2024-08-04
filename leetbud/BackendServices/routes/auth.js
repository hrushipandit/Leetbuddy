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
    //        res.redirect('/');  
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
        console.log('User authenticated, redirecting...');
        console.log("These are the cookies before being sent", req.cookies); // Log cookies to see what's being sent
        console.log("These are the headers", (req.headers));
        console.log("Incoming cookies: ", req.headers.cookie); // Inspect headers to check cookie transmission
        // Successful authentication, redirect home.
        res.redirect('https://www.leetbud.com');
    } );




router.get('/auth/login/status', (req, res) => {
    console.log('Checking login status...');
    if (req.isAuthenticated()) {  // Passport provides this method to check authentication status
        console.log('User is logged in:', req.user);

        res.json({ isLoggedIn: true, user: req.user }); // Optionally, send user data
    } else {
        console.log('User is not logged in');
        res.json({ isLoggedIn: false });
    }
});

module.exports = router;