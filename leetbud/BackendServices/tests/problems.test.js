const express = require('express');
const bodyParser = require('body-parser');
const request = require('supertest');
const routes = require('../routes/problems'); // Adjust the path as necessary
const { isAuthenticated } = require('./utils/mockMiddleware'); // Path to your mock middleware

const app = express();
app.use(bodyParser.json());

// Apply mock middleware instead of actual authentication middleware
app.use(isAuthenticated);

app.use('/api/problems', routes);

describe('POST /', () => {
    it('should save a new entry and return it', async () => {
        const postData = {
            googleId: 'testGoogleId', // Ensure this matches what would be set by your isAuthenticated middleware in production
            code: 'Sample code',
            notes: 'Sample notes',
            question_name: 'Sample question name',
            question: 'What is the meaning of life?'
        };

        const response = await request(app)
            .post('/api/problems')
            .send(postData)
            .expect(200);

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
            // Missing question_name and question fields
        };

        await request(app)
            .post('/api/problems')
            .send(postData)
            .expect(400);
    });
});
