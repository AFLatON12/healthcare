import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/api';
import './SignupPage.css';

const SignupPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        dob: '',
        phone_number: '',
        address: ''
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
            // Create registration data without confirmPassword
            const registrationData = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                password: formData.password,
                dob: formData.dob,
                phone_number: formData.phone_number,
                address: formData.address
            };

            const response = await authService.register(registrationData);
            localStorage.setItem('token', response.token);
            localStorage.setItem('role', response.role);
            navigate('/patient/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
                        <label>First Name</label>
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            placeholder="Enter your first name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            placeholder="Enter your last name"
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
                        <label>Date of Birth</label>
                        <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Phone Number</label>
                        <input
                            type="tel"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Address</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter your address"
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
                            minLength="8"
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
                            minLength="8"
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