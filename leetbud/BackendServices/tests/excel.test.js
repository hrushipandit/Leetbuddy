const express = require('express');
const request = require('supertest');
const bodyParser = require('body-parser');
const ExcelJS = require('exceljs');
const UserEntry = require('../models/UserEntry');
const isAuthenticated = require('./utils/mockMiddleware').isAuthenticated;

// Mocking ExcelJS to bypass actual file writing during tests
jest.mock('exceljs', () => {
    return {
        Workbook: jest.fn().mockImplementation(() => {
            const worksheet = {
                columns: jest.fn(),
                addRows: jest.fn()
            };
            return {
                addWorksheet: jest.fn(() => worksheet),
                xlsx: {
                    write: jest.fn().mockImplementation(() => console.log("Writing to response..."))
                }
            };
        })
    };
});

// Mocking UserEntry model to simulate database operations without real MongoDB
jest.mock('../models/UserEntry', () => {
    return {
        find: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue([
            { question_name: 'How does JavaScript work?', code: 'console.log("Hello, world!");', notes: 'Basics of JS execution.' },
            { question_name: 'What is a closure?', code: 'function outer() { let count = 0; function inner() { return ++count; } return inner; }', notes: 'Understanding closures in JavaScript.' }
        ])
    };
});

const app = express();
app.use(bodyParser.json());
app.use(isAuthenticated);

// Route that handles downloading entries as an Excel file
app.get('/download-entries', isAuthenticated, async (req, res) => {
    try {
        // Fetching entries based on user's Google ID
        const entries = await UserEntry.find({ googleId: req.user.googleId }).select('-_id question_name code notes');

        // Setting up a new Excel workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('My Problems');

        worksheet.columns = [
            { header: 'Question Name', key: 'question_name', width: 30 },
            { header: 'Code', key: 'code', width: 50 },
            { header: 'Notes', key: 'notes', width: 50 }
        ];
        // Adding rows from fetched entries into the worksheet
        worksheet.addRows(entries);

        // Setting headers for the response to indicate a file download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="entries.xlsx"');

        // Writing the Excel content to the HTTP response
        await workbook.xlsx.write(res);

        res.status(200).end();
    } catch (error) {
        console.error('Error during Excel file generation:', error);
        res.status(500).json({ error: 'Failed to generate download' });
    }
});

// Test suite for /download-entries route
describe('/download-entries route', () => {
    it('should download entries as an Excel file', async () => {
        const response = await request(app).get('/download-entries');
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    });

});
