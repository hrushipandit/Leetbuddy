const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserEntry = require('./models/UserEntry'); // Ensure this path is correct

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI; // It's best to move sensitive info to environment variables
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // Allow only your frontend to interact with the backend
    credentials: true, // Allow cookies to be sent with requests
}));

// Session configuration
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // Set to true in production when using HTTPS
        httpOnly: true
    }
}));


// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Passport Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback"
},
    function (accessToken, refreshToken, profile, cb) {
        cb(null, profile);
        console.log(profile);
    }));

passport.serializeUser((user, done) => {
    done(null, user.id);  // Store only googleId or a unique user identifier
    console.log('Serialized User');
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await UserEntry.findOne({ googleId: id });
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Google Auth Routes
app.get('/auth/google', (req, res, next) => {
    console.log('Attempting to authenticate with Google');
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});


app.get('/auth/google/callback',

    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('http://localhost:3000');
    });

// Define routes
const problemRoutes = require('./routes/problems');
app.use('/api/problems', problemRoutes);


// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
