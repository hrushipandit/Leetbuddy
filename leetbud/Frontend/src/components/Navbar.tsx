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
            const response = await axios.get('http://localhost:5000/auth/login/status', { withCredentials: true });
            console.log(response.data.isLoggedIn);
            setIsLoggedIn(response.data.isLoggedIn);
        } catch (error) {
            console.error('Failed to check login status:', error);
        }
    };

    const handleLogin = () => {
        // Redirect to Google OAuth login
        window.location.href = 'http://localhost:5000/auth/google';
    };

    const handleLogout = async () => {
        try {
            axios.get('http://localhost:5000/logout', { withCredentials: true });
            setIsLoggedIn(false);
            console.log(setIsLoggedIn);
            setTimeout(() => navigate('/'), 0);  // Use navigate to redirect
        } catch (error) {
            console.log(error);
            console.error('Logout failed:', error);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-links">
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    {isLoggedIn && (
                        <>
                            <li>
                                <Link to="/practice">Practice</Link>
                            </li>
                            <li>
                                <Link to="/problems">Problem List</Link>
                            </li>
                        </>
                    )}
                    {isLoggedIn ? (
                        <button onClick={handleLogout}>Logout</button>
                    ) : (
                        <button onClick={handleLogin}>Login with Google</button>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
