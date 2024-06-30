import React from 'react'
import { useState, useEffect } from 'react';
import './AddEditProblems.css'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios for HTTP requests
export const AddEditProblems = () => {
    axios.defaults.withCredentials = true;
    const navigate = useNavigate(); // Hook for navigation
    const { id } = useParams(); 
    const[code, setCode] = useState('');
    const [notes, setNotes] = useState('');
    const [question_name, setQuestion_name] = useState('');
    const [question, setQuestion] = useState('');
    const [fetchingQuestion, setFetchingQuestion] = useState(false);
    const [fetchedQuestion, setFetchedQuestion] = useState('');

    useEffect(() => {
        if (id) {
            // If there's an ID, we're editing an existing problem
            axios.get(`http://localhost:5000/api/problems/${id}`)
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

    const goBack = () => {
      navigate(-1); // Navigates to the previous page
    };

    const fetchLeetCodeQuestion = async () => {
        if (!question_name.trim()) {
            alert('Please enter a valid question name');
            return;
        }

        setFetchingQuestion(true);

        try {
            const response = await axios.post('http://localhost:5000/fetch-leetcode-question', {
                questionName: question_name
            }, { withCredentials: true });

            setFetchedQuestion(response.data.questionText);
            setFetchingQuestion(false);
        } catch (error) {
            console.error('Error fetching question:', error);
            setFetchingQuestion(false);
        }
    };

    const handleSubmit = async () => {
        const payload = { code, notes, question_name , question }; // No Google ID sent from client
        const url = `http://localhost:5000/api/problems/${id ? id : ''}`;
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

    const handleGenerateNotes = async () => {
        try {
            const payload = { code, question, question_name };
            const response = await axios.post('http://localhost:5000/generate-notes', payload, { withCredentials: true });
            setNotes(response.data.generatedNotes);
            console.log('Notes generated:', response.data.generatedNotes);
        } catch (error) {
            console.error('Error generating notes:', error);
        }
    };

    return (
        <div className="container">
            <h1 className="title">Add/Edit Problems</h1>
            <div className="question_name-section">
                <label htmlFor="question_name">Add Question Name Here:</label>
                <textarea
                    id="question_name"
                    placeholder="Type your question name here..."
                    value={question_name}
                    onChange={(e) => setQuestion_name(e.target.value)}
                />
                <button onClick={fetchLeetCodeQuestion} disabled={fetchingQuestion}>
                    {fetchingQuestion ? 'Fetching...' : 'Fetch Question from LeetCode'}
                </button>
            </div>
            {fetchedQuestion && (
                <div className="fetched-question-section">
                    <label htmlFor="fetchedQuestion">Fetched Question:</label>
                    <textarea
                        id="fetchedQuestion"
                        value={fetchedQuestion}
                        readOnly
                    />
                </div>
            )}
            <div className="question-section">
                <label htmlFor="question">Add Question Here:</label>
                <textarea
                    id="question"
                    placeholder="Type your question here..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />
            </div>
            <div className="code-section">
                <label htmlFor="code">Add Code Here:</label>
                <textarea
                    id="code"
                    placeholder="Type your code here..."
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
            </div>
            <div className="notes-section">
                <label htmlFor="notes">Your Notes:</label>
                <textarea
                    id="notes"
                    placeholder="Write your notes here..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
                <button onClick={handleGenerateNotes}>Generate Notes</button>
            </div>
            <button className="submit-button" onClick={handleSubmit}>Submit</button>
            <button className="go-back-button" onClick={goBack}>Go Back</button>
        </div>
    );

};

export default AddEditProblems
