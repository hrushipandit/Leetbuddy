// routes/problems.js
const express = require('express');
const router = express.Router();
const UserEntry = require('../models/UserEntry'); 

//Post Operation

router.post('/', (req, res) => {
    const { code, notes, question_name } = req.body;
    const { googleID } = req.user.googleId;
    console.log(googleID);

    if (!req.user) {
        return res.status(401).send('User not authenticated');
    }

    if (!code || !notes || !question_name) {
        return res.status(400).json({ message: 'Code and notes are required.' });
    }

    const newUserEntry = new UserEntry({ googleID, code, notes, question_name });
    newUserEntry.save()
        .then(entry => res.json(entry))
        .catch(err => res.status(500).json('Error: ' + err));
});

//Get Operation

router.get('/', (req, res) => {

    if (!req.user) {
        return res.status(401).send('User not authenticated');
        console.log('User not authenticated');
    }

    UserEntry.find({ googleId: req.user.googleId })
        .sort({ date: -1 }) // Sort by date in descending order if date field exists
        .then(entries => res.json(entries))
        .catch(err => res.status(400).json('Error: ' + err));
    console.log('Getting stuff');
});

//id get

router.get('/:id', (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
        console.log('User not authenticated');
    }

    UserEntry.findById(req.params.id)
        .then(problem => {
            if (!problem) {
                return res.status(404).json({ noProblemFound: 'No problem found with that ID' });
            }

            // Check if the logged in user is the owner of the entry
            if (problem.googleId !== req.user.googleId) {
                return res.status(403).json({ error: 'Unauthorized to access this resource' });
            }

            res.json(problem);
        })
        .catch(err => res.status(500).json({ error: 'Error fetching the problem' }));
});


//Put
router.put('/:id', (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    UserEntry.findById(req.params.id)
        .then(entry => {
            if (!entry) {
                return res.status(404).json({ error: 'No entry found with that ID' });
            }
            if (entry.googleId !== req.user.googleId) {
                return res.status(403).json({ error: 'Unauthorized to modify this entry' });
            }

            entry.code = req.body.code;
            entry.notes = req.body.notes;
            entry.question_name = req.body.question_name;

            entry.save()
                .then(() => res.json('Problem updated!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(404).json('Error: ' + err));
});


//Delete Operation

router.delete('/:id', (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    UserEntry.findById(req.params.id)
        .then(entry => {
            if (!entry) {
                return res.status(404).json({ error: 'No entry found with that ID' });
            }
            if (entry.googleId !== req.user.googleId) {
                return res.status(403).json({ error: 'Unauthorized to delete this entry' });
            }

            entry.remove()
                .then(() => res.json({ message: 'Entry deleted successfully!' }))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(404).json('Error: ' + err));
});


module.exports = router;