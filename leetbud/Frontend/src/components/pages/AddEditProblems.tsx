import React from 'react'
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; 

// Component for adding or editing problems, supporting both create and update operations
export const AddEditProblems = () => {
    axios.defaults.withCredentials = true; // Enable Axios to send cookies with each request
    const navigate = useNavigate(); // React Router hook for navigation
    const { id } = useParams(); // Capture 'id' from URL if present

    // State hooks for form fields and operational states
    const[code, setCode] = useState('');
    const [notes, setNotes] = useState('');
    const [question_name, setQuestion_name] = useState('');
    const [question, setQuestion] = useState('');
    const [fetchingQuestion, setFetchingQuestion] = useState(false);
    const [fetchedQuestion, setFetchedQuestion] = useState('');

    // Effect hook to load existing data if 'id' is present (edit mode)
    useEffect(() => {
        if (id) {
            // If there's an ID, we're editing an existing problem
            axios.get(`https://www.leetbud.com/api/problems/${id}`)
                .then(response => {
                    const { code, notes, question_name, question } = response.data;
                    console.log(response.data);
                    setCode(code);
                    setNotes(notes);
                    setQuestion_name(question_name);
                    setQuestion(question);
                })
                .catch(error => console.error('Error fetching data:', error));
        }
    }, [id]); 

    // Navigate back to the previous page
    const goBack = () => {
      navigate(-1); // Navigates to the previous page
    };

    // Fetch a question from LeetCode based on the 'question_name'
    const fetchLeetCodeQuestion = async () => {
        if (!question_name.trim()) {
            alert('Please enter a valid question name');
            return;
        }

        setFetchingQuestion(true);

        try {
            const response = await axios.post('https://www.leetbud.com/fetch-leetcode-question', {
                questionName: question_name
            }, { withCredentials: true });

            setFetchedQuestion(response.data.questionText);
            setFetchingQuestion(false);
            setQuestion(response.data.questionText);
        } catch (error) {
            console.error('Error fetching question:', error);
            setFetchingQuestion(false);
        }
    };
    // Handle form submission for adding or updating a problem
    const handleSubmit = async () => {
        const payload = { code, notes, question_name , question }; // No Google ID sent from client
        const url = `https://www.leetbud.com/api/problems/${id ? id : ''}`;
        const method = id ? 'put' : 'post';

        try {
            const response = await axios({
                method: method,
                url: url,
                data: payload,
                withCredentials: true
            });
            console.log('Saved to MongoDB:', response.data);
            navigate(-1);
        } catch (error) {
            console.error('Error saving to MongoDB:', error);
        }
    };

    // Generate notes for the current problem using an API call
    const handleGenerateNotes = async () => {
        try {
            const payload = { code, question, question_name };
            const response = await axios.post('https://www.leetbud.com/generate-notes', payload, { withCredentials: true });
            setNotes(response.data.generatedNotes);
            console.log('Notes generated:', response.data.generatedNotes);
        } catch (error) {
            console.error('Error generating notes:', error);
        }
    };

    // Disable 'Generate Notes' button if any fields are empty
    const isGenerateDisabled = !code.trim() || !question.trim() || !question_name.trim();

    // Render form UI
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-center text-xl font-bold mb-4">Add/Edit Problems</h1>
            <div className="mb-4">
                <label htmlFor="question_name" className="block text-sm font-medium text-gray-700">Add Question Name Here:</label>
                <textarea
                    id="question_name"
                    placeholder="Type your question name here..."
                    value={question_name}
                    onChange={(e) => setQuestion_name(e.target.value)}
                    className="mt-1 p-2 w-full border-gray-300 rounded-md shadow-sm"
                 />
            </div>
           
            <div className="mb-4">
                <label htmlFor="question" className="block text-sm font-medium text-gray-700">Add Question Here:</label>
                <textarea
                    id="question"
                    placeholder="Type your question here..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="mt-1 p-2 w-full border-gray-300 rounded-md shadow-sm"
                    rows={6}
                />
            </div>
            
            
            <div className="mb-4">
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">Add Code Here:</label>
                <textarea
                    id="code"
                    placeholder="Type your code here..."
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="mt-1 p-2 w-full border-gray-300 rounded-md shadow-sm"
                    rows={6}
                />
            </div>
            <div className="mb-4">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Your Notes:</label>
                <textarea
                    id="notes"
                    placeholder="Write your notes here..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="mt-1 p-2 w-full border-gray-300 rounded-md shadow-sm"
                    rows={6}
                />
                <button onClick={handleGenerateNotes}
                    disabled={isGenerateDisabled}
                    className={`mt-2 px-4 py-2 rounded-md text-white ${isGenerateDisabled ? 'bg-gray-400' : 'bg-indigo-500 hover:bg-indigo-600'}`}>
                    Generate Notes
                </button>
            </div>
            <button className="mt-2 w-full py-2 bg-green-500 hover:bg-green-700 text-white rounded-md" onClick={handleSubmit}>Submit</button>
            <button className="mt-2 w-full py-2 bg-gray-500 hover:bg-gray-700 text-white rounded-md" onClick={goBack}>Go Back</button>
        </div>
    );

};

export default AddEditProblems
