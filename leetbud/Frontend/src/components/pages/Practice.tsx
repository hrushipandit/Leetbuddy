import React, { useState, useEffect } from 'react';
import ReactCardFlip from 'react-card-flip';
import axios from 'axios';
import './Practice.css';

interface Problem {
    _id: string;
    question_name: string;
    question: string,
    code: string;
    notes: string;
    nextReviewDate: Date;
}

export const Practice = () => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [problems, setProblems] = useState<Problem[]>([]);
    const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
    const [allReviewed, setAllReviewed] = useState(false); 

    useEffect(() => {
        fetchProblems();
    }, []);

    const fetchProblems = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/problems/reviews', { withCredentials: true });
            setProblems(response.data.length ? response.data : []);
            setAllReviewed(response.data.length === 0);
        } catch (error) {
            console.error('Error fetching problems:', error);
        }
    };

    const flipCard = () => {
        setIsFlipped(!isFlipped);
    };


    const handleReviewSubmit = async (quality: number) => {
        const problemId = problems[currentProblemIndex]._id;
        try {
            await axios.put(`http://localhost:5000/api/problems/review/${problemId}`, { quality }, { withCredentials: true });
            moveToNextProblem();
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    const handleGetHint = async () => {
        const { code, question_name, question } = problems[currentProblemIndex];
        try {
            const response = await axios.post('http://localhost:5000/generate-hints', {
                code,
                question_name,
                question,
                withCredentials: true
            });
            alert('Hint: ' + response.data.hint); // Display the hint in an alert or set it in the state to display in the UI
        } catch (error) {
            console.error('Error fetching hint:', error);
        }
    };

    const moveToNextProblem = () => {
        const nextIndex = (currentProblemIndex + 1) % problems.length;
        setCurrentProblemIndex(nextIndex);
        setIsFlipped(false);
        if (nextIndex === 0) {
            setAllReviewed(true);
        }
    };

    if (allReviewed) {
        return <div><h2>Thank you for completing your reviews for today!</h2></div>;
    }

    const { question, question_name, code, notes } = problems[currentProblemIndex] || {};

    return (
        <div>
            <ReactCardFlip flipDirection='horizontal' isFlipped={isFlipped}>
                <div className='card' onClick={flipCard}>
                    <h1>{question_name}</h1>
                    <h1>{question}</h1>
                </div>
                <div className='card card-back' onClick={flipCard}>
                    <h1>Code</h1>
                    <p>{code}</p>
                    <h1>Notes</h1>
                    <p>{notes}</p>
                </div>
            </ReactCardFlip>
            <button onClick={() => handleReviewSubmit(1)}>Hard</button>
            <button onClick={() => handleReviewSubmit(3)}>Good</button>
            <button onClick={() => handleReviewSubmit(5)}>Easy</button>
            <button onClick={handleGetHint}>Get Hint</button>
        </div>
    );
};

export default Practice;
