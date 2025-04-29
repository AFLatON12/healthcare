import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/api';
import './LoginPage.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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

        try {
            const response = await authService.login(formData);
            localStorage.setItem('token', response.token);
            localStorage.setItem('role', response.role);
            navigate(response.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    const handleSocialLogin = (provider) => {
        window.location.href = `/api/auth/${provider.toLowerCase()}`;
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Welcome Back</h1>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
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
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button type="submit" className="login-button">
                        Sign In
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

                <div className="signup-options">
                    <p>Don't have an account?</p>
                    <div className="signup-links">
                        <Link to="/signup">Sign up as Patient</Link>
                        <span>or</span>
                        <Link to="/join-us">Join as Doctor</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage; 