const express = require('express');
const passport = require('passport');
const router = express.Router();


/**
 * Handles the logout operation by clearing the user's session and cookies.
 * It checks if the user is logged in, logs them out, destroys the session, and clears the related cookie.
 */
router.get('/auth/logout', (req, res) => {
    // Check if any user is currently logged in
    if (!req.user) {
        return res.status(400).send('No user currently logged in.');
    }
    // Perform logout operation using Passport
    req.logout((err) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Failed to log out.');
        }
        // Destroy the session after logging out
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Failed to destroy session.');
            }
            // Clear the authentication cookie
            res.clearCookie('connect.sid', { domain: '.leetbud.com',
            path: '/',
            secure: true, 
            httpOnly: true, 
            SameSite: 'None',
            });
        res.status(200).send('Logged out successfully');            
        });
    });
});

/**
 * Initiates authentication via Google using Passport.
 * It uses the Google OAuth strategy to request user's profile and email information.
 */
router.get('/auth/google', (req, res, next) => {
    console.log('Attempting to authenticate with Google');
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

/**
 * Callback route for Google authentication.
 * Redirects the user on successful authentication or sends them to the login page on failure.
 */
router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('https://www.leetbud.com');
    } );



/**
* Checks the login status of a user.
* If authenticated, returns true and user information; otherwise, returns false.
*/
router.get('/auth/login/status', (req, res) => {
    console.log('Checking login status...');
    if (req.isAuthenticated()) {  
        console.log('User is logged in:', req.user);

        res.json({ isLoggedIn: true, user: req.user }); 
    } else {
        console.log('User is not logged in');
        res.json({ isLoggedIn: false });
    }
});

module.exports = router;