const express = require('express');
const router = express.Router();
const UserEntry = require('../models/UserEntry');
const passport = require('passport'); 



// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
   // console.log("No problem here", req.user);
    //console.log("Session:", req.session);
    if (!req.user) {
     //   console.log(req);
        console.log('This is triggering');
        return res.status(401).json({ error: 'User not authenticated' });
    }
    next();
}

// Post Operation
router.post('/', isAuthenticated, async (req, res) => {
  //  console.log("I am here start");
    const { code, notes, question_name } = req.body;
    if (!code || !notes || !question_name) {
     //   console.log("I am here required");
        return res.status(400).json({ message: 'Code, notes, and question name are required.' });
    }
   // console.log(code, notes, question_name);
    try {
        const newUserEntry = new UserEntry({
            googleId: req.user.googleId,  // Assuming googleId is correctly retrieved from req.user
            code: code,                  // Corrected to use data from req.body
            notes: notes,                // Corrected to use data from req.body
            question_name: question_name, // Corrected to use data from req.body
        });
     //   console.log("New user entry is ", newUserEntry);
        const entry = await newUserEntry.save();
        res.json(entry);
    } catch (err) {
      //  console.log("I am here");
        
        res.status(500).json({ error: 'Error saving the problem' });
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
        console.log(err);
        res.status(400).json({ error: 'Error deleting the problem' });
    }
});




module.exports = router;
