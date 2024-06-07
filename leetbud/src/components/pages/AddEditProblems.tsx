import React from 'react'
import './AddEditProblems.css'
import { useNavigate } from 'react-router-dom';

export const AddEditProblems = () => {
    const navigate = useNavigate(); // Hook for navigation

    const goBack = () => {
      navigate(-1); // Navigates to the previous page
    };
  return (
    <div className="container">
      <h1 className="title">Add/Edit Problems</h1> 
      <div className="code-section">
        <label htmlFor="code">Add Code Here:</label>
        <textarea id="code" placeholder="Type your code here..." />
      </div>
      <div className="notes-section">
        <label htmlFor="question">Your Question:</label>
        <textarea id="question" placeholder="Write your question here..." />
        <button>Generate Notes</button>
      </div>
      <button className="submit-button">Submit</button>
      <button className="go-back-button" onClick={goBack}>Go Back</button>
    </div>
  )
}

export default AddEditProblems
