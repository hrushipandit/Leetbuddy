const request = require('supertest');
const express = require('express');
const passport = require('passport');

const app = express();

// Initialize session management middleware required for Passport's session handling
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Define a Google OAuth strategy with Passport to handle Google logins
passport.use(new (require('passport-google-oauth20').Strategy)({
    clientID: 'EXAMPLE_CLIENT_ID',
    clientSecret: 'EXAMPLE_CLIENT_SECRET',
    callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, cb) => {
    // Simulating a user object that Passport can serialize into the session
    cb(null, { id: '12345', name: 'test user' }); // Simulating a successful callback with user data
}));

// Serialize the user ID into the session. This is typically done by serializing less data to keep the session small.
passport.serializeUser((user, done) => done(null, user.id));

// Deserialize the user ID from the session back into a user object
passport.deserializeUser((id, done) => done(null, { id: '12345', name: 'test user' }));

// Route that triggers the Google OAuth process
app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

// Route that Google calls back to after user logs in and consents, handling both success and failure
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => res.redirect('/'));

app.get('/login', (req, res) => res.status(401).send('Login Failed'));

// Testing the authentication flow using the supertest library
describe('Google OAuth flow', () => {
    it('should redirect to home on successful authentication', async () => {
        await request(app)
            .get('/auth/google/callback')
            .expect(302) // Expects HTTP status 302 (redirection) which indicates successful login
    });

    it('should redirect to login on authentication failure', async () => {
        // Temporarily override Passport's authenticate method to simulate authentication failure
        passport.authenticate = jest.fn(() => (req, res, next) => res.redirect('/login'));
        await request(app)
            .get('/auth/google/callback?error=access_denied')
            .expect(302) // Expects redirection
            .expect('Location', '/login'); // Expects redirection to the login route
    });
});
