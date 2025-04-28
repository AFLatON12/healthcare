import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/WelcomePage.css';

function WelcomePage() {
  return (
    <div className="welcome-container">
      <h1>Welcome to Our Healthcare App</h1>
      <p>Please login or sign up to continue.</p>
      <div className="welcome-buttons">
        <Link to="/login" className="btn">
          Login
        </Link>
        <Link to="/signup" className="btn">
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default WelcomePage;
