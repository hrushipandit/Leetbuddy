const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserEntry = require('./models/UserEntry'); 
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.set('trust proxy', 1);  // This line tells Express to trust the first proxy in front of it

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'https://www.leetbud.com', // Allow only your frontend to interact with the backend
    credentials: true, // Allow cookies to be sent with requests
}));

// Session configuration 
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        domain: '.leetbud.com',
        path: '/',
        secure: true, 
        httpOnly: true, 
        SameSite: 'None',
    }
}));



// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Passport Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://www.leetbud.com/auth/google/callback"
},
    async (accessToken, refreshToken, profile, cb) => {
        try {
            console.log('Profile:', profile);
            console.log('Access Token:', accessToken);
            // Check if the user already exists in your database
            let user = await UserEntry.findOne({ googleId: profile.id });
            if (!user) {
                // If user is not found, create a new user
                user = await UserEntry.create({
                    googleId: profile.id,
                    code: 123,
                    notes: 123,
                    question: 123,
                    question_name: 123123,
                });
            }
            console.log('User found or created:', user);
            return cb(null, user); // Pass user to serializeUser
        } catch (err) {
            console.error('Error during user authentication:', err);
            return cb(err, null);
        }
    }));

passport.serializeUser((user, done) => {

    done(null, user.googleId); 
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
    console.log('Session ID:', req.sessionID);
    console.log('Session data:', req.session);
    next();
});


// Define routes
const problemRoutes = require('./routes/problems');
const authRoutes = require('./routes/auth');
const openAIRoutes = require('./routes/openai');
const excelRoutes = require('./routes/excel');
const seleniumRoutes = require('./routes/selenium')

app.use('/api/problems', problemRoutes);
app.use(authRoutes);
app.use(openAIRoutes);
app.use(excelRoutes);
app.use(seleniumRoutes);



// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
