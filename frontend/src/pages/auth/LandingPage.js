import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    const handleSocialLogin = (provider) => {
        // Redirect to the appropriate OAuth endpoint
        window.location.href = `/api/auth/${provider.toLowerCase()}`;
    };

    return (
        <div className="landing-container">
            <div className="landing-card">
                <h1>Welcome to Healthcare</h1>
                <p className="subtitle">Your trusted platform for healthcare services</p>

                <div className="social-login">
                    <button
                        className="social-button google"
                        onClick={() => handleSocialLogin('Google')}
                    >
                        <img src="/icons/google-icon.svg" alt="Google" />
                        Continue with Google
                    </button>
                    <button
                        className="social-button facebook"
                        onClick={() => handleSocialLogin('Facebook')}
                    >
                        <img src="/icons/facebook-icon.svg" alt="Facebook" />
                        Continue with Facebook
                    </button>
                </div>

                <div className="divider">
                    <span>or</span>
                </div>

                <div className="auth-buttons">
                    <Link to="/login" className="login-button">
                        Login
                    </Link>
                    <Link to="/signup" className="signup-button">
                        Sign Up
                    </Link>
                </div>

                <div className="doctor-link">
                    <p>Are you a healthcare provider?</p>
                    <Link to="/join-us">Join us as a Doctor</Link>
                </div>
            </div>
        </div>
    );
};

export default LandingPage; 