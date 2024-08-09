const express = require('express');
const bodyParser = require('body-parser');
const request = require('supertest');
const routes = require('../routes/problems'); // Importing routes from problems.js, adjust the path as necessary
const { isAuthenticated } = require('./utils/mockMiddleware'); // Import mock authentication middleware for testing

const app = express();
app.use(bodyParser.json()); // Middleware to parse JSON request bodies

// Apply mock middleware instead of actual authentication middleware
app.use(isAuthenticated);

// Mount problem-related routes under the '/api/problems' path
app.use('/api/problems', routes);

// Testing suite for problem entry management
describe('POST /', () => {
    it('should save a new entry and return it', async () => {
        const postData = {
            googleId: 'testGoogleId', // Ensure this matches what would be set by your isAuthenticated middleware in production
            code: 'Sample code',
            notes: 'Sample notes',
            question_name: 'Sample question name',
            question: 'What is the meaning of life?'
        };

        // Test to ensure that a POST request to create a new problem entry behaves as expected
        const response = await request(app)
            .post('/api/problems')
            .send(postData)
            .expect(200);
        // Verify that the response body contains the data that was sent in the POST request
        expect(response.body).toMatchObject({
            googleId: expect.any(String),
            code: postData.code,
            notes: postData.notes,
            question_name: postData.question_name,
            question: postData.question
        });
    });

    it('should return 400 if required fields are missing', async () => {
        const postData = {
            code: 'Sample code',
            notes: 'Sample notes',
            // Intentionally missing question_name and question to test error handling
        };
        // Test to ensure that missing required fields results in a 400 error
        await request(app)
            .post('/api/problems')
            .send(postData)
            .expect(400); // Expect HTTP 400 status code for bad request
    });
});
