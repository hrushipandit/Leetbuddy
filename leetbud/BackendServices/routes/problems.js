const express = require('express');
const router = express.Router();
const UserEntry = require('../models/UserEntry');
const passport = require('passport'); 

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    next();
}

// Post Operation
router.post('/', isAuthenticated, async (req, res) => {
    const { code, notes, question_name } = req.body;

    if (!code || !notes || !question_name) {
        return res.status(400).json({ message: 'Code, notes, and question name are required.' });
    }

    try {
        const newUserEntry = new UserEntry({
            googleId: req.user.googleId,
            code,
            notes,
            question_name
        });
        const entry = await newUserEntry.save();
        res.json(entry);
    } catch (err) {
        res.status(500).json({ error: 'Error saving the problem' });
    }
});

// Get Operation
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const entries = await UserEntry.find({ googleId: req.user.googleId }).sort({ date: -1 });
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

// Update Operation
router.put('/:id', isAuthenticated, async (req, res) => {
    try {
        const { code, notes, question_name } = req.body;
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
        await entry.save();
        res.json('Problem updated!');
    } catch (err) {
        res.status(400).json({ error: 'Error updating the problem' });
    }
});

// Delete Operation
router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        const entry = await UserEntry.findById(req.params.id);
        if (!entry) {
            return res.status(404).json({ error: 'No entry found with that ID' });
        }
        if (entry.googleId !== req.user.googleId) {
            return res.status(403).json({ error: 'Unauthorized to delete this entry' });
        }
        await entry.remove();
        res.json({ message: 'Entry deleted successfully!' });
    } catch (err) {
        res.status(400).json({ error: 'Error deleting the problem' });
    }
});




module.exports = router;
