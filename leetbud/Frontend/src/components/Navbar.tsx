import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './Navbar.css';
import axios from 'axios';

export const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();  // Use navigate for redirection

    useEffect(() => {
        checkLoginStatus();
    }, []);

    const checkLoginStatus = async () => {
        try {
            const response = await axios.get('https://www.leetbud.com/auth/login/status', { withCredentials: true });
            console.log(response.data.isLoggedIn);
            setIsLoggedIn(response.data.isLoggedIn);
        } catch (error) {
            console.error('Failed to check login status:', error);
        }
    };

    const handleLogin = () => {
        // Redirect to Google OAuth login
        window.location.href = 'https://www.leetbud.com/auth/google';
    };

    const handleLogout = async () => {
        try {
            axios.get('https://www.leetbud.com/logout', { withCredentials: true });
            setIsLoggedIn(false);
            console.log(setIsLoggedIn);
            setTimeout(() => navigate('/'), 0);  // Use navigate to redirect
        } catch (error) {
            console.log(error);
            console.error('Logout failed:', error);
        }
    };

    return (
        <nav className="bg-blue-700 py-2 px-4 shadow-md flex justify-between items-center">
            <div className="flex space-x-4">
                <Link to="/" className="text-white font-semibold hover:text-indigo-300">Home</Link>
                {isLoggedIn && (
                    <>
                        <Link to="/practice" className="text-white font-semibold hover:text-indigo-300">Practice</Link>
                        <Link to="/problems" className="text-white font-semibold hover:text-indigo-300">Problem List</Link>
                    </>
                )}
            </div>
            {isLoggedIn ? (
                <button onClick={handleLogout} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Logout</button>
            ) : (
                <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Login with Google</button>
            )}
        </nav>
    );
}

export default Navbar;
