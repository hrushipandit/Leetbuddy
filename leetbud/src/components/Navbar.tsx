import React from 'react'

import {Link} from "react-router-dom";
import './Navbar.css';

export const Navbar = () => {
  return (
    <nav className="navbar">
        <div className="navbar-links">
            <ul>
                <li>
                    <Link to="/practice"> Practice  </Link>
                </li>
                <li>
                    <Link to="/problems"> Problem List </Link>
                </li>
            </ul>
        </div>
        <div className="nav-right">
              <a href="http://localhost:5000/auth/google">Sign In with Google</a>

        </div>
    </nav>
  )
}

export default Navbar
