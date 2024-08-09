const OpenAI = require('openai');

// Initializes the OpenAI client with the API key from environment variables
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const express = require('express');
const router = express.Router();
/**
 * POST route to generate notes for a given coding problem and its solution.
 * Requires the code, the problem statement, and the problem name.
 * Returns generated notes that summarize the solution approach and complexity.
 */
router.post('/generate-notes', async (req, res) => {
    const { code, question, question_name } = req.body;

    // Validate the presence of required fields
    if (!code || !question || !question_name) {
        return res.status(400).json({ message: 'All fields must be provided.' });
    }

    try {
        // Request to generate concise notes from OpenAI using the provided code and question details
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { "role": "user", "content": `Generate a concise notes, these notes should be useful in reviewing what the solution implementation so that the user may get an idea what his original implementation was b, what was the basic pattern behind it and what was the time complexity:\n\nQuestion Name: ${question_name}\nQuestion: ${question}\nCode: ${code}\n\nNotes:` }
            ]
        });


        // Extracting generated notes from the response
        const message = response.choices[0].message.content;
        console.log("The response here is ", message);
        res.json({ generatedNotes: message });
    } catch (error) {
        console.log('Error with OpenAI API:', error);
        res.status(500).json({ error: 'Failed to generate poem' });
    }
    
});

/**
 * POST route to generate hints for solving a given coding problem based on the code, question, and question name.
 * The hints aim to provide insights into problem-solving approaches and optimizations.
 */
router.post('/generate-hints', async (req, res) => {
    const { code, question, question_name } = req.body;
    // Validate the presence of required fields
    if (!code || !question || !question_name) {
        return res.status(400).json({ message: 'Code, question, and question name must be provided.' });
    }

    try {
        // Request to generate hints from OpenAI using the provided details
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "user", content: `Generate a hint for solving the problem based on the following details:\nQuestion Name: ${question_name}\nQuestion: ${question}\nCode: ${code}\nPlease provide insights that help in understanding the problem-solving approach and any potential optimizations.` }
            ]
        });

        // Extract the message content from the first choice provided by the API response
        const hint = response.choices[0].message.content;

        console.log("Generated Hint:", hint);
        res.json({ hint });
    } catch (error) {
        console.log('Error with OpenAI API:', error);
        res.status(500).json({ error: 'Failed to generate hint' });
    }
});

module.exports = router;
