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
const mongoURI = process.env.MONGO_URI;
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
        secure: false, // Should be true in production with HTTPS
        httpOnly: true  // Ensures cookies are sent only over HTTP(S), not client JavaScript, helping to protect against cross-site scripting attacks.
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
    async (accessToken, refreshToken, profile, cb) => {
        try {
            // Check if the user already exists in your database
            let user = await UserEntry.findOne({ googleId: profile.id });
            if (!user) {
                // If user is not found, create a new user
                user = await UserEntry.create({
                    googleId: profile.id,
                    code: 123,
                    notes: 123,
                    question_name: 123123,
                });
            }
            return cb(null, user); // Pass user to serializeUser
        } catch (err) {
            return cb(err, null);
        }
    }));

passport.serializeUser((user, done) => {
    // console.log(user);  // Log to confirm the structure of the user object
    console.log('User Serialized');
    done(null, user.googleId);  // Ensure user.id is the correct identifier
});
passport.deserializeUser(async (googleId, done) => {
    try {

        console.log('User Deserialized');
        const user = await UserEntry.findOne({ googleId: googleId });
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

app.use((req, res, next) => {
    console.log("Session Data:", req.session);
    console.log("User Data:", req.user);
    next();
});
// Define routes
const problemRoutes = require('./routes/problems');
const authRoutes = require('./routes/auth');

app.use('/api/problems', problemRoutes);


app.use(authRoutes);
// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
