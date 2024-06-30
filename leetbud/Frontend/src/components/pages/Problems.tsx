import React, { useState, useEffect } from 'react';
import axios from 'axios';  // Make sure to import axios
import './Problems.css';
import { Link, useNavigate } from "react-router-dom";

interface Entry {
    _id: string;
    code: string;
    notes: string;
    question_name: string;
}


function Problems() {
    const [entries, setEntries] = useState<Entry[]>([]); // Define state inside the component
    const navigate = useNavigate();


    useEffect(() => {
        axios.get('http://localhost:5000/api/problems', { withCredentials: true })
            .then(response => {
                setEntries(response.data);
                console.log(entries);// Update state with fetched data
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []); // Empty dependency array means this runs once on component mount

    const fetchEntries = () => {
        axios.get('http://localhost:5000/api/problems', { withCredentials: true })
            .then(response => {
                setEntries(response.data);
                console.log(entries);
            })
            .catch(error => console.error('Error fetching data:', error));
    };

    const deleteEntry = (id: string) => {
        axios.delete(`http://localhost:5000/api/problems/${id}`, { withCredentials: true })
            .then(() => {
                fetchEntries();
            })
            .catch(error => console.error('Error deleting entry:', error));
    };

    const handleEdit = (id: string) => {
        navigate(`/AddEditProblems/${id}`); // Redirects to the edit page with the problem ID
    };


    return (
        <div className="problems-container">
            <ul>
                <li>
                    <Link to="/AddEditProblems" className="add-link">Add new Problems</Link>
                    <button onClick={() => window.location.href = 'http://localhost:5000/download-entries'}>
                        Download Entries
                    </button>
                </li>

                {Array.isArray(entries) ? entries.map(entry => (
                    <div key={entry._id}>
                        <h3>Question:</h3>
                        <p>{entry.question_name}</p>
                        <button className="edit-button" onClick={() => handleEdit(entry._id)}>Edit</button>
                        <button className="delete-button" onClick={() => deleteEntry(entry._id)}>Delete</button>
                    </div>
                )) : <li>No problems found or data is not loaded yet.</li>}
            </ul>
        </div>
    );
}

export default Problems;
