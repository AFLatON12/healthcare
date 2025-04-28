import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/DoctorProfile.css';

const DoctorProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        firstName: 'Sarah',
        lastName: 'Wilson',
        email: 'sarah.wilson@example.com',
        phoneNumber: '+1 234 567 8900',
        specialization: 'Cardiology',
        experience: '15 years',
        education: 'MD, Harvard Medical School',
        hospital: 'City General Hospital',
        address: '123 Medical Center Dr, Suite 456',
        bio: 'Experienced cardiologist specializing in preventive cardiology and heart disease management. Committed to providing personalized care and staying current with the latest medical advancements.'
    });

    const handleChange = (e) => {
        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement profile update logic
        console.log('Profile update:', profileData);
        setIsEditing(false);
    };

    return (
        <div className="doctor-profile">
            <div className="profile-header">
                <h1>Doctor Profile</h1>
                <div className="header-actions">
                    <Link to="/doctor/dashboard" className="back-link">Back to Dashboard</Link>
                    <button
                        className={`edit-btn ${isEditing ? 'save' : ''}`}
                        onClick={() => isEditing ? handleSubmit() : setIsEditing(true)}
                    >
                        {isEditing ? 'Save Changes' : 'Edit Profile'}
                    </button>
                </div>
            </div>

            <div className="profile-content">
                <div className="profile-card">
                    <div className="profile-image">
                        <img src="https://via.placeholder.com/150" alt="Doctor" />
                        {isEditing && (
                            <button className="change-photo-btn">Change Photo</button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="profile-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="firstName">First Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={profileData.firstName}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="lastName">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={profileData.lastName}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={profileData.email}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phoneNumber">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={profileData.phoneNumber}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="specialization">Specialization</label>
                                <input
                                    type="text"
                                    id="specialization"
                                    name="specialization"
                                    value={profileData.specialization}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="experience">Experience</label>
                                <input
                                    type="text"
                                    id="experience"
                                    name="experience"
                                    value={profileData.experience}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="education">Education</label>
                            <input
                                type="text"
                                id="education"
                                name="education"
                                value={profileData.education}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="hospital">Hospital</label>
                            <input
                                type="text"
                                id="hospital"
                                name="hospital"
                                value={profileData.hospital}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="address">Address</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={profileData.address}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="bio">Bio</label>
                            <textarea
                                id="bio"
                                name="bio"
                                value={profileData.bio}
                                onChange={handleChange}
                                disabled={!isEditing}
                                rows="4"
                            />
                        </div>

                        {isEditing && (
                            <div className="form-actions">
                                <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="save-btn">
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DoctorProfile; 