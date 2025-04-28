import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/JoinUsPage.css';

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

    const renderStep1 = () => (
        <>
            <h2>Personal Information</h2>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="dateOfBirth">Date of Birth</label>
                    <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="address">Address</label>
                <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                />
            </div>
        </>
    );

    const renderStep2 = () => (
        <>
            <h2>Professional Information</h2>
            <div className="form-group">
                <label htmlFor="specialization">Specialization</label>
                <input
                    type="text"
                    id="specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="licenseNumber">Medical License Number</label>
                <input
                    type="text"
                    id="licenseNumber"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="experience">Years of Experience</label>
                <input
                    type="number"
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                    min="0"
                />
            </div>

            <div className="form-group">
                <label htmlFor="education">Education</label>
                <textarea
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    required
                    placeholder="List your educational qualifications"
                />
            </div>

            <div className="form-group">
                <label htmlFor="currentWorkplace">Current Workplace</label>
                <input
                    type="text"
                    id="currentWorkplace"
                    name="currentWorkplace"
                    value={formData.currentWorkplace}
                    onChange={handleChange}
                    required
                />
            </div>
        </>
    );

    const renderStep3 = () => (
        <>
            <h2>Additional Information</h2>
            <div className="form-group">
                <label htmlFor="languages">Languages Spoken</label>
                <input
                    type="text"
                    id="languages"
                    name="languages"
                    value={formData.languages}
                    onChange={handleChange}
                    required
                    placeholder="e.g., English, Spanish, French"
                />
            </div>

            <div className="form-group">
                <label htmlFor="availability">Availability</label>
                <textarea
                    id="availability"
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    required
                    placeholder="Describe your availability for consultations"
                />
            </div>

            <div className="form-group">
                <label htmlFor="resume">Upload Resume (PDF)</label>
                <input
                    type="file"
                    id="resume"
                    name="resume"
                    onChange={handleChange}
                    accept=".pdf"
                    required
                />
            </div>
        </>
    );

    return (
        <div className="join-us-container">
            <div className="join-us-card">
                <h1>Join Our Medical Team</h1>
                {error && <div className="error-message">{error}</div>}

                <div className="progress-bar">
                    <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>1</div>
                    <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>2</div>
                    <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>3</div>
                </div>

                <form onSubmit={handleSubmit}>
                    {currentStep === 1 && renderStep1()}
                    {currentStep === 2 && renderStep2()}
                    {currentStep === 3 && renderStep3()}

                    <div className="form-buttons">
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={() => setCurrentStep(currentStep - 1)}
                                className="btn-secondary"
                            >
                                Previous
                            </button>
                        )}
                        <button type="submit" className="btn-primary">
                            {currentStep === 3 ? 'Submit' : 'Next'}
                        </button>
                    </div>
                </form>

                <div className="auth-links">
                    <p>Already have an account? <Link to="/login">Login here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default JoinUsPage; 