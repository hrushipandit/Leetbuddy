const express = require('express');
const router = express.Router();
const UserEntry = require('../models/UserEntry');
const ExcelJS = require('exceljs');

// Middleware to ensure the user is authenticated
function isAuthenticated(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    next();
}

router.get('/download-entries', isAuthenticated, async (req, res) => {
    try {
        const entries = await UserEntry.find({ googleId: req.user.googleId }).select('-_id question_name code notes');

        const workbook = new ExcelJS.Workbook(); // Create a new workbook
        const worksheet = workbook.addWorksheet('My Problems'); // Add a worksheet

        // Define columns in the worksheet
        worksheet.columns = [
            { header: 'Question Name', key: 'question_name', width: 30 },
            { header: 'Code', key: 'code', width: 50 },
            { header: 'Notes', key: 'notes', width: 50 }
        ];

        // Add rows using the data fetched from the database
        worksheet.addRows(entries);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="entries.xlsx"');

        await workbook.xlsx.write(res); // Write the workbook to the HTTP response
        res.status(200).end();
    } catch (error) {
        console.error('Failed to download entries:', error);
        res.status(500).json({ error: 'Failed to generate download' });
    }
});

module.exports = router;
