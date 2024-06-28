const express = require('express');
const router = express.Router();
const UserEntry = require('../models/UserEntry');
const passport = require('passport'); 



// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    if (!req.user) {
        console.log('This is triggering');
        return res.status(401).json({ error: 'User not authenticated' });
    }
    next();
}

// Post Operation
router.post('/', isAuthenticated, async (req, res) => {
    const { code, notes, question_name, question } = req.body;
    if (!code || !notes || !question_name || !question) {
        return res.status(400).json({ message: 'Code, notes, and question name are required.' });
    }
    try {
        const newUserEntry = new UserEntry({
            googleId: req.user.googleId,  // Assuming googleId is correctly retrieved from req.user
            code: code,                  // Corrected to use data from req.body
            notes: notes,                // Corrected to use data from req.body
            question_name: question_name, // Corrected to use data from req.body
            question: question,
        });
        const entry = await newUserEntry.save();
        res.json(entry);
    } catch (err) {
        
        res.status(500).json({ error: 'Error saving the problem' });
    }
});

// Update Operation
router.put('/:id', isAuthenticated, async (req, res) => {
    try {
        const { code, notes, question_name, question } = req.body;
        const entry = await UserEntry.findById(req.params.id);
        if (!entry) {
            return res.status(404).json({ error: 'No entry found with that ID' });
        }
        if (entry.googleId !== req.user.googleId) {
            return res.status(403).json({ error: 'Unauthorized to modify this entry' });
        }
        entry.code = code;
        entry.notes = notes;
        entry.question_name = question_name;
        entry.question = question;
        await entry.save();
        res.json('Problem updated!');
    } catch (err) {
        res.status(400).json({ error: 'Error updating the problem' });
    }
});

// GET reviews for today
router.get('/reviews', async (req, res) => {
    console.log("were here");
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to 00:00:00 to include all reviews from today

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // Set to the next day
    console.log(today, tomorrow);

    try {
        const reviewsToday = await UserEntry.find({
            nextReviewDate: {
                $gte: today, // Select entries where nextReviewDate is greater than or equal to start of today
                $lt: tomorrow     // and less than the start of tomorrow
            },
            googleId: req.user.googleId // Assuming you want to fetch reviews specific to the logged-in user
        });

        console.log("list of problem", reviewsToday);

        if (reviewsToday.length === 0) {
            return res.status(404).json({ message: 'No reviews due for today' });
        }

        res.json(reviewsToday);
    } catch (error) {
        console.error('Error fetching today\'s reviews:', error);
        res.status(500).json({ error: 'Server error' });
    }
}
);


// Get Operation
router.get('/', isAuthenticated, async (req, res) => {
    try {
        // Fetch entries where 'question_name' is not a placeholder
        const entries = await UserEntry.find({
            googleId: req.user.googleId,
            question_name: { $ne: "123123" }  // Assuming "123123" is the placeholder you want to exclude
        }).sort({ date: -1 });

        // Optionally, you can remove the filter if you just want to comment about placeholder values
        // and handle them differently in your application logic.

        res.json(entries);
    } catch (err) {
        res.status(400).json({ error: 'Error fetching problems' });
    }
});

// ID get
router.get('/:id', isAuthenticated, async (req, res) => {
    try {
        const problem = await UserEntry.findById(req.params.id);
        if (!problem) {
            return res.status(404).json({ noProblemFound: 'No problem found with that ID' });
        }
        if (problem.googleId !== req.user.googleId) {
            return res.status(403).json({ error: 'Unauthorized to access this resource' });
        }
        res.json(problem);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching the problem' });
    }
}); 


// Delete Operation
router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        const entry = await UserEntry.findById(req.params.id);
        if (!entry) {
            console.log('No entry found with that ID');
            return res.status(404).json({ error: 'No entry found with that ID' });
        }
        if (entry.googleId !== req.user.googleId) {
            console.log('Unauthorized to delete this entry');
            return res.status(403).json({ error: 'Unauthorized to delete this entry' });
        }
        await UserEntry.deleteOne({ _id: entry._id });
        res.json({ message: 'Entry deleted successfully!' });
    } catch (err) {
        console.log('Error deleting the problem');
     //   console.log(err);
        res.status(400).json({ error: 'Error deleting the problem' });
    }
});

// Update review details of an existing entry
router.put('/review/:id', isAuthenticated, async (req, res) => {
    const { quality } = req.body; // Quality of the review, passed from the client

    try {
        const entry = await UserEntry.findById(req.params.id);

        if (!entry) {
            return res.status(404).json({ error: 'No entry found with that ID' });
        }

        if (entry.googleId !== req.user.googleId) {
            return res.status(403).json({ error: 'Unauthorized to access this resource' });
        }

        // Update the E-Factor and repetition according to the SuperMemo algorithm
        const newEFactor = Math.max(1.3, entry.eFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
        const newRepetition = quality < 3 ? 0 : entry.repetition + 1;
        let newInterval;
        if (newRepetition === 0) {
            newInterval = 1;
        } else if (newRepetition === 1) {
            newInterval = 6;
        } else {
            newInterval = Math.ceil(entry.nextReviewDate * newEFactor);
        }

        entry.eFactor = newEFactor;
        entry.repetition = newRepetition;
        entry.lastReviewed = Date.now();
        entry.nextReviewDate = new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000);

        await entry.save();
        res.json(entry);
    } catch (err) {
        res.status(500).json({ error: 'Error updating the review details' });
    }
});


module.exports = router;
