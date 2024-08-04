import React, { useState, useEffect } from 'react';
import ReactCardFlip from 'react-card-flip';
import axios from 'axios';
import './Practice.css';
import { ReactNode } from 'react';
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
            const response = await axios.get('https://www.leetbud.com/api/problems/reviews', { withCredentials: true });
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
            await axios.put(`https://www.leetbud.com/api/problems/review/${problemId}`, { quality }, { withCredentials: true });
            moveToNextProblem();
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    const handleGetHint = async () => {
        const { code, question_name, question } = problems[currentProblemIndex];
        try {
            const response = await axios.post('https://www.leetbud.com/generate-hints', {
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

    const renderTextWithNewLines = (text: string): ReactNode => {
        return text.split('\n').map((str: string, index: number) => (
            <React.Fragment key={index}>
                {str}
                <br />
            </React.Fragment>
        ));
    };

    const { question, question_name, code, notes } = problems[currentProblemIndex] || {};

    return (
        <div>
            {problems.length === 0 ? (
                <div><h2>No problems are available for review today.</h2></div>
            ) : (
                !allReviewed ? (
                    <>
                            <ReactCardFlip flipDirection='horizontal' isFlipped={isFlipped}>
                                <div className='card bg-white shadow-md cursor-pointer' onClick={flipCard}>
                                    <h1 className="text-2xl font-bold">{question_name}</h1>
                                    <p className="text-lg whitespace-pre-wrap overflow-auto full-height-content">{question}</p>
                                </div>
                                <div className='card card-back bg-white shadow-md cursor-pointer' onClick={flipCard}>
                                    <div className="half-height-content">
                                        <h1 className="text-2xl font-bold">Code</h1>
                                        <pre className="text-left whitespace-pre-wrap overflow-auto text-sm bg-gray-100 p-3 rounded-lg">{code}</pre>
                                    </div>
                                    <div className="half-height-content">
                                        <h1 className="text-2xl font-bold">Notes</h1>
                                        <pre className="text-lg whitespace-pre-wrap">{notes}</pre>
                                    </div>
                                </div>
                            </ReactCardFlip>
                        <button className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700" onClick={() => handleReviewSubmit(1)}>Hard</button>
                        <button className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700" onClick={() => handleReviewSubmit(3)}>Good</button>
                        <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700" onClick={() => handleReviewSubmit(5)}>Easy</button>
                        <button className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-700" onClick={handleGetHint}>Get Hint</button>
                    </>
                ) : (
                    <div><h2>Thank you for completing your reviews for today!</h2></div>
                )
            )}
        </div>
    );
};

export default Practice;