import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

interface Entry {
    _id: string;
    code: string;
    notes: string;
    question_name: string;
}

function Problems() {
    const [entries, setEntries] = useState<Entry[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('https://www.leetbud.com/api/problems', { withCredentials: true })
            .then(response => {
                setEntries(response.data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const deleteEntry = (id: string) => {
        axios.delete(`https://www.leetbud.com/api/problems/${id}`, { withCredentials: true })
            .then(() => {
                setEntries(entries.filter(entry => entry._id !== id));
            })
            .catch(error => console.error('Error deleting entry:', error));
    };

    const handleEdit = (id: string) => {
        navigate(`/AddEditProblems/${id}`);
    };

    return (
        <div className="max-w-4xl mx-auto p-5">
            <ul>
                <li className="mb-4">
                    <Link to="/AddEditProblems" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Add new Problems
                    </Link>
                    <button onClick={() => window.location.href = 'https://www.leetbud.com/download-entries'}
                        className="ml-4 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                        Download Entries
                    </button>
                </li>
                {Array.isArray(entries) && entries.length > 0 ? entries.map(entry => (
                    <div key={entry._id} className="bg-gray-100 p-4 rounded shadow mb-3">
                        <h3 className="font-bold text-lg mb-2">Question: {entry.question_name}</h3>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded mr-2"
                            onClick={() => handleEdit(entry._id)}>
                            Edit
                        </button>
                        <button className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
                            onClick={() => deleteEntry(entry._id)}>
                            Delete
                        </button>
                    </div>
                )) : <li>No problems found or data is not loaded yet.</li>}
            </ul>
        </div>
    );
}

export default Problems;
