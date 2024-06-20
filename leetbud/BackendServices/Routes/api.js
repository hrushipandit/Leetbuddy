const express = require('express');
const router = express.Router();
const UserEntry = require('../models/UserEntry');

// Route to handle POST request to save user data
router.post('/save', (req, res) => {
    const { code, notes } = req.body;

    const newUserEntry = new UserEntry({
        code,
        notes
    });

    newUserEntry.save()
        .then(entry => res.json(entry))
        .catch(err => console.log(err));
});

module.exports = router;
