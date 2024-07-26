import React from 'react'

export const Home = () => {
    return (
        <div className="min-h-screen bg-blue-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl font-bold text-blue-800 sm:text-5xl">
                    Welcome to Leetbud!
                </h1>
                <p className="mt-4 text-lg text-blue-700">
                    Your ultimate coding practice companion. Use Leetbud to enhance your problem-solving skills with features tailored for effective learning and revision.
                </p>
                <div className="mt-6 text-gray-700 text-left">
                    <h2 className="text-xl font-semibold text-blue-600">Features:</h2>
                    <ul className="list-disc space-y-2 ml-5 mt-3 text-gray-600">
                        <li>Revise using the SuperMemo algorithm to efficiently improve recall.</li>
                        <li>Get AI-based hints powered by GPT-3.5 Turbo while solving problems to enhance understanding.</li>
                        <li>Fetch coding problems directly from the LeetCode website.</li>
                        <li>Generate custom notes and insights as you learn.</li>
                        <li>Download your questions and code into Excel for a personalized database.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Home