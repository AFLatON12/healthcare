import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import './SignupPage.css';

const SignupPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await authAPI.signup(formData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', 'patient');
            navigate('/patient/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred during signup');
        }
    };

    const handleSocialLogin = (provider) => {
        window.location.href = `/api/auth/${provider.toLowerCase()}`;
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <h1>Create Your Account</h1>
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            required
                        />
                    </div>

                    <button type="submit" className="signup-button">
                        Create Account
                    </button>
                </form>

                <div className="divider">
                    <span>or continue with</span>
                </div>

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

                <div className="login-options">
                    <p>Already have an account?</p>
                    <div className="login-links">
                        <Link to="/login">Sign in</Link>
                        <span>or</span>
                        <Link to="/join-us">Join as Doctor</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage; 