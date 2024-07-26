const request = require('supertest');
const express = require('express');
const passport = require('passport');

const app = express();

// Mocking passport initialization and session management
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Mocking Passport Strategy to simulate login
passport.use(new (require('passport-google-oauth20').Strategy)({
    clientID: 'EXAMPLE_CLIENT_ID',
    clientSecret: 'EXAMPLE_CLIENT_SECRET',
    callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, cb) => {
    cb(null, { id: '12345', name: 'test user' }); // Simulating a successful callback with user data
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => done(null, { id: '12345', name: 'test user' }));

app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => res.redirect('/'));

app.get('/login', (req, res) => res.status(401).send('Login Failed'));

// Tests
describe('Google OAuth flow', () => {
    it('should redirect to home on successful authentication', async () => {
        await request(app)
            .get('/auth/google/callback')
            .expect(302)
    });

    it('should redirect to login on authentication failure', async () => {
        // Overriding Passport authenticate to simulate failure
        passport.authenticate = jest.fn(() => (req, res, next) => res.redirect('/login'));
        await request(app)
            .get('/auth/google/callback?error=access_denied')
            .expect(302)
            .expect('Location', '/login');
    });
});
