import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './Navbar.css';
import axios from 'axios';

export const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();  // Use navigate for redirection

    // Check login status on component mount
    useEffect(() => {
        checkLoginStatus();
    }, []);

    // Function to check if the user is currently logged in
    const checkLoginStatus = async () => {
        try {
            const response = await axios.get('https://www.leetbud.com/auth/login/status', { withCredentials: true });
            console.log(response.data.isLoggedIn);
            setIsLoggedIn(response.data.isLoggedIn);
        } catch (error) {
            console.error('Failed to check login status:', error);
        }
    };
    // Redirect to Google OAuth login
    const handleLogin = () => {
        // Redirect to Google OAuth login
        window.location.href = 'https://www.leetbud.com/auth/google';
    };

    // Handle user logout
    const handleLogout = async () => {
        try {
            await axios.get('https://www.leetbud.com/auth/logout', { withCredentials: true });
            // Clear all cookies related to the domain
            document.cookie.split(";").forEach(function (c) {
                var cookieName = c.split('=')[0].trim();
                document.cookie = cookieName + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.leetbud.com; Secure; SameSite=None';
            });
            setIsLoggedIn(false);
            setTimeout(() => navigate('/'), 0); // Missing comma corrected if part of larger object
        } catch (error) {
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
