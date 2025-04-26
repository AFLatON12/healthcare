import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './JoinUsPage.css';

const JoinUsPage = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Personal Information
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        dateOfBirth: '',
        gender: '',
        address: '',

        // Professional Information
        specialization: '',
        licenseNumber: '',
        experience: '',
        education: '',
        currentWorkplace: '',

        // Additional Information
        languages: '',
        availability: '',
        resume: null
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'file' ? files[0] : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            // TODO: Implement actual API call
            console.log('Doctor registration attempt:', formData);
            navigate('/doctor/dashboard');
        } catch (error) {
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <div className="join-us-container">
            <div className="join-us-card">
                <h1>Join Our Medical Team</h1>
                {error && <div className="error-message">{error}</div>}

                <div className="steps-indicator">
                    <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>Personal Info</div>
                    <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>Professional Info</div>
                    <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>Additional Info</div>
                </div>

                <form onSubmit={handleSubmit}>
                    {currentStep === 1 && (
                        <div className="form-section">
                            <div className="form-group">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
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
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="form-section">
                            <div className="form-group">
                                <label>Specialization</label>
                                <input
                                    type="text"
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>License Number</label>
                                <input
                                    type="text"
                                    name="licenseNumber"
                                    value={formData.licenseNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Years of Experience</label>
                                <input
                                    type="number"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Education</label>
                                <textarea
                                    name="education"
                                    value={formData.education}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="form-section">
                            <div className="form-group">
                                <label>Languages Spoken</label>
                                <input
                                    type="text"
                                    name="languages"
                                    value={formData.languages}
                                    onChange={handleChange}
                                    placeholder="e.g., English, Spanish"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Availability</label>
                                <textarea
                                    name="availability"
                                    value={formData.availability}
                                    onChange={handleChange}
                                    placeholder="Please specify your available hours"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Upload Resume/CV</label>
                                <input
                                    type="file"
                                    name="resume"
                                    onChange={handleChange}
                                    accept=".pdf,.doc,.docx"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div className="form-navigation">
                        {currentStep > 1 && (
                            <button
                                type="button"
                                className="back-button"
                                onClick={() => setCurrentStep(currentStep - 1)}
                            >
                                Back
                            </button>
                        )}
                        <button type="submit" className="next-button">
                            {currentStep === 3 ? 'Submit' : 'Next'}
                        </button>
                    </div>
                </form>

                <div className="login-link">
                    <p>Already registered? <Link to="/login">Login here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default JoinUsPage; 