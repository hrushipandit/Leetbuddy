const OpenAI = require('openai');

// Create a new instance of the OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const express = require('express');
const router = express.Router();

router.post('/generate-notes', async (req, res) => {
    const { code, question, question_name } = req.body;

    if (!code || !question || !question_name) {
        return res.status(400).json({ message: 'All fields must be provided.' });
    }

    try {
        const completion = await openai.completions.create({
            model: "gpt-3.5-turbo",
            prompt: "Generate a concise note:\n\nQuestion Name: ${question_name}\nQuestion: ${question}\nCode: ${code}\n\nNotes:",
            max_tokens: 150,
        });

        const notes = response.data.choices[0].text.trim();
        res.json({ generatedNotes: notes });
    } catch (error) {
        console.error('Error with OpenAI API:', error);
        res.status(500).json({ error: 'Failed to generate notes' });
    }
});

module.exports = router;
