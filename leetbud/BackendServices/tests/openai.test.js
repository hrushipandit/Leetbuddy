const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { chat } = require('openai');

// Mock only the create function from the OpenAI API
jest.mock('openai', () => ({
    chat: {
        completions: {
            create: jest.fn()
        }
    }
}));

const app = express();
app.use(bodyParser.json());

app.post('/generate-notes', async (req, res) => {
    const { code, question, question_name } = req.body;
    if (!code || !question || !question_name) {
        return res.status(400).json({ message: 'All fields must be provided.' });
    }

    try {
        const response = await chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: `Generate concise notes for: ${question_name}. Question: ${question}, Code: ${code}`
                }
            ]
        });

        const notes = response.choices[0].message.content;
        res.json({ generatedNotes: notes });
    } catch (error) {
        console.error('Error with OpenAI API:', error);
        res.status(500).json({ error: 'Failed to generate notes' });
    }
});

describe('/generate-notes', () => {
    it('should return generated notes on valid input', async () => {
        const fakeResponse = {
            choices: [{
                message: {
                    content: 'Generated notes based on the code and question provided.'
                }
            }]
        };
        chat.completions.create.mockResolvedValue(fakeResponse);

        const response = await request(app)
            .post('/generate-notes')
            .send({
                code: 'return recursion;',
                question: 'Explain recursion',
                question_name: 'Recursion in Depth'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.generatedNotes).toEqual('Generated notes based on the code and question provided.');
    });
});
