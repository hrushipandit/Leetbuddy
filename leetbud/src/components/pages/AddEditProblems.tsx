import React from 'react'
import { useState, useEffect } from 'react';
import './AddEditProblems.css'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios for HTTP requests
export const AddEditProblems = () => {
    const navigate = useNavigate(); // Hook for navigation
    const { id } = useParams(); 
    const[code, setCode] = useState('');
    const [notes, setNotes] = useState('');
    const [question_name, setQuestion_name] = useState('');

    useEffect(() => {
        if (id) {
            // If there's an ID, we're editing an existing problem
            axios.get(`http://localhost:5000/api/problems/${id}`)
                .then(response => {
                    const { code, notes, question_name } = response.data;
                    setCode(code);
                    setNotes(notes);
                    setQuestion_name(question_name);
                })
                .catch(error => console.error('Error fetching data:', error));
        }
    }, [id]); 

    const goBack = () => {
      navigate(-1); // Navigates to the previous page
    };

    const handleGenerateNotes = () => {
        // Implement note generation logic if needed
        console.log('Generate Notes button clicked');
    };

    const handleSubmit = async () => {
        const payload = { code, notes, question_name };
        const url = `http://localhost:5000/api/problems/${id ? id : ''}`;
        const method = id ? 'put' : 'post';

        try {
            const response = await axios[method](url, payload);
            console.log('Saved to MongoDB:', response.data);
            navigate(-1); // Go back after submission
        } catch (error) {
            console.error('Error saving to MongoDB:', error);
        }
    };

    return (
        <div className="container">
            <h1 className="title">Add/Edit Problems</h1>
            <div className="question_name-section">
                <label htmlFor="question_name">Add Question Here:</label>
                <textarea
                    id="question_name"
                    placeholder="Type your question_name here..."
                    value={question_name}
                    onChange={(e) => setQuestion_name(e.target.value)}
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
                    id="question"
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
