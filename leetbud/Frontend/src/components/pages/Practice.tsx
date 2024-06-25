import React, { useState } from 'react'
import ReactCardFlip from 'react-card-flip';
import './Practice.css';

export const Practice = () => {


    const[isFlipped,setisFlipped] = useState(false);

    function flipcard()
    {
        setisFlipped(!isFlipped);
    }
    return (
    <div>
        <ReactCardFlip flipDirection='horizontal' isFlipped = {isFlipped}>
        <div className='card' onClick={flipcard}>
            <h1>Question</h1>
        </div>

        <div className='card card-back' onClick={flipcard}>
            <h1>Code</h1>
            <h1>Notes</h1>
        </div>
        </ReactCardFlip>
    <button>Hint 1</button>
    <button>Hint 2</button>
    <button>Hint 3</button>
    </div>
  )
}

export default Practice
