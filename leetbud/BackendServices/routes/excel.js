const express = require('express');
const router = express.Router();
const UserEntry = require('../models/UserEntry');
const ExcelJS = require('exceljs');

/**
 * Middleware to ensure that the user is authenticated before proceeding.
 * If the user is not authenticated, it sends a 401 error response.
 */
function isAuthenticated(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    next();
}

/**
 * Route to download user entries in Excel format.
 * This route uses the isAuthenticated middleware to ensure the user is logged in.
 * It retrieves user-specific entries from the database, creates an Excel file, and sends it as a download.
 */

router.get('/download-entries', isAuthenticated, async (req, res) => {
    try {
        // Fetch user-specific entries from the database by the Google user ID
        const entries = await UserEntry.find({ googleId: req.user.googleId }).select('-_id question_name code notes');
        // Initialize a new Excel workbook
        const workbook = new ExcelJS.Workbook();
        // Add a new worksheet titled 'My Problems'
        const worksheet = workbook.addWorksheet('My Problems'); 

        // Define columns in the worksheet
        worksheet.columns = [
            { header: 'Question Name', key: 'question_name', width: 30 },
            { header: 'Code', key: 'code', width: 50 },
            { header: 'Notes', key: 'notes', width: 50 }
        ];

        // Add rows using the data fetched from the database
        worksheet.addRows(entries);

        // Set HTTP headers to indicate a file attachment with the appropriate MIME type
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="entries.xlsx"');

        // Write the Excel workbook to the HTTP response
        await workbook.xlsx.write(res); // Write the workbook to the HTTP response
        res.status(200).end();
    } catch (error) {
        console.error('Failed to download entries:', error);
        res.status(500).json({ error: 'Failed to generate download' });
    }
});

module.exports = router;
