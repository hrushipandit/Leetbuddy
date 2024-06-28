import React, { useState, useEffect } from 'react';
import ReactCardFlip from 'react-card-flip';
import axios from 'axios';
import './Practice.css';

interface Problem {
    _id: string;
    question_name: string;
    code: string;
    notes: string;
    nextReviewDate: Date;
}

export const Practice = () => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [problems, setProblems] = useState<Problem[]>([]);
    const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
    const [allReviewed, setAllReviewed] = useState(false); // State to check if all problems are reviewed

    useEffect(() => {
        fetchProblems();
    }, []);

    const fetchProblems = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/problems/reviews', { withCredentials: true });
            if (response.data.length === 0) {
                setAllReviewed(true); // No problems to review, set all reviewed to true
            } else {
                setProblems(response.data);
            }
            console.log('Problems fetched:', response.data);
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
            console.log('Review updated for problem:', problemId);

            const nextIndex = (currentProblemIndex + 1) % problems.length;
            if (nextIndex === 0) {
                setAllReviewed(true); // If we're back at the first problem, all problems have been reviewed
            }
            setCurrentProblemIndex(nextIndex);
            setIsFlipped(false); // Reset card flip for the next problem
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    const restartReview = () => {
        setCurrentProblemIndex(0);
        setAllReviewed(false);
        setIsFlipped(false);
    };

    if (allReviewed) {
        return (
            <div>
                <h2>Thank you for completing your reviews for today!</h2>
            </div>
        );
    }

    if (problems.length === 0) {
        return <div> All done for today!.</div>;
    }

    const { question_name, code, notes } = problems[currentProblemIndex];

    return (
        <div>
            <ReactCardFlip flipDirection='horizontal' isFlipped={isFlipped}>
                <div className='card' onClick={flipCard}>
                    <h1>{question_name}</h1>
                </div>
                <div className='card card-back' onClick={flipCard}>
                    <h1>Code</h1>
                    <p>{code}</p>
                    <h1>Notes</h1>
                    <p>{notes}</p>
                </div>
            </ReactCardFlip>
            <div>
                <button onClick={() => handleReviewSubmit(1)}>Hard</button>
                <button onClick={() => handleReviewSubmit(3)}>Good</button>
                <button onClick={() => handleReviewSubmit(5)}>Easy</button>
            </div>
        </div>
    );
};

export default Practice;
