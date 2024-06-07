import React from 'react';
import { Link } from "react-router-dom";
import './Problems.css'

export const Problems = () => {
  const problems = [
    { id: 1, name: "Sample Problem 1" },
    { id: 2, name: "Sample Problem 2" }
  ];

  return (
    <div className="problems-container">
      <ul>
        <li>
          <Link to="/AddEditProblems" className="add-link">Add new Problems</Link>
        </li>
        {problems.map(problem => (
          <li key={problem.id} className="problem-item">
            <p>{problem.name}</p>
            <button className="edit-button">Edit</button>
            <button className="delete-button">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Problems;
