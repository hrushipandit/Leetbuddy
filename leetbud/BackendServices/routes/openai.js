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
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { "role": "user", "content": `Generate a concise notes, these notes should be useful in reviewing what the solution implementation so that the user may get an idea what his original implementation was b, what was the basic pattern behind it and what was the time complexity:\n\nQuestion Name: ${question_name}\nQuestion: ${question}\nCode: ${code}\n\nNotes:` }
            ]
        });
        console.log(response);


        //   const notes = response.data.choices[0].text.trim();
        const message = response.choices[0].message.content;
        console.log("The response here is ", message);
        res.json({ generatedNotes: message });
    } catch (error) {
        console.log('Error with OpenAI API:', error);
        res.status(500).json({ error: 'Failed to generate poem' });
    }
    
});

router.post('/generate-hints', async (req, res) => {
    const { code, question, question_name } = req.body;

    if (!code || !question || !question_name) {
        return res.status(400).json({ message: 'Code, question, and question name must be provided.' });
    }

    try {
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
