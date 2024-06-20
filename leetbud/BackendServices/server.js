const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');

// Use routes


const app = express();
const PORT = process.env.PORT || 5000; // Port number, adjust as needed
app.use('/api', apiRoutes);
// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
const mongoURI = 'mongodb+srv://rishi:Jobdedo*26@cluster0.1uhlal2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Define routes here

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
