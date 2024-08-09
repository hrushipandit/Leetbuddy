const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { chat } = require('openai');

// Mock the create function from the OpenAI API's chat.completions to simulate API responses
jest.mock('openai', () => ({
    chat: {
        completions: {
            create: jest.fn()
        }
    }
}));

const app = express();
app.use(bodyParser.json());

// POST endpoint to generate notes using OpenAI
app.post('/generate-notes', async (req, res) => {
    const { code, question, question_name } = req.body;
    // Validate that all required fields are present
    if (!code || !question || !question_name) {
        return res.status(400).json({ message: 'All fields must be provided.' });
    }

    try {
        // Use the mocked OpenAI API to generate notes
        const response = await chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: `Generate concise notes for: ${question_name}. Question: ${question}, Code: ${code}`
                }
            ]
        });
        // Extract notes from the API response
        const notes = response.choices[0].message.content;
        res.json({ generatedNotes: notes });
    } catch (error) {
        // Handle errors from the OpenAI API
        console.error('Error with OpenAI API:', error);
        res.status(500).json({ error: 'Failed to generate notes' });
    }
});

// Testing the /generate-notes endpoint
describe('/generate-notes', () => {
    it('should return generated notes on valid input', async () => {
        // Define what the mock should return once called
        const fakeResponse = {
            choices: [{
                message: {
                    content: 'Generated notes based on the code and question provided.'
                }
            }]
        };
        chat.completions.create.mockResolvedValue(fakeResponse);
        // Make a request to the endpoint with sample data
        const response = await request(app)
            .post('/generate-notes')
            .send({
                code: 'return recursion;',
                question: 'Explain recursion',
                question_name: 'Recursion in Depth'
            });
        // Check that the response is as expected
        expect(response.statusCode).toBe(200);
        expect(response.body.generatedNotes).toEqual('Generated notes based on the code and question provided.');
    });
});
