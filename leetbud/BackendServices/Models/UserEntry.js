const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserEntrySchema = new Schema({

    googleId: {
        type: String,
        required: true,
        unique: true
    },

    code: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        required: true
    },
    question_name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = UserEntry = mongoose.model('userEntry', UserEntrySchema);
