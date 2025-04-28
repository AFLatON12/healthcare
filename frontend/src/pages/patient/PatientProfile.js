import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/PatientProfile.css';

const PatientProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '+1 234 567 8900',
        dateOfBirth: '1985-05-15',
        gender: 'Male',
        bloodGroup: 'O+',
        address: '123 Main St, Apt 456',
        emergencyContact: {
            name: 'Jane Doe',
            relationship: 'Spouse',
            phone: '+1 234 567 8901'
        },
        medicalHistory: 'No significant medical history. Regular check-ups only.',
        allergies: 'None known'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('emergency.')) {
            const field = name.split('.')[1];
            setProfileData({
                ...profileData,
                emergencyContact: {
                    ...profileData.emergencyContact,
                    [field]: value
                }
            });
        } else {
            setProfileData({
                ...profileData,
                [name]: value
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement profile update logic
        console.log('Profile update:', profileData);
        setIsEditing(false);
    };

    return (
        <div className="patient-profile">
            <div className="profile-header">
                <h1>Patient Profile</h1>
                <div className="header-actions">
                    <Link to="/patient/dashboard" className="back-link">Back to Dashboard</Link>
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
                        <img src="https://via.placeholder.com/150" alt="Patient" />
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
                                <label htmlFor="dateOfBirth">Date of Birth</label>
                                <input
                                    type="date"
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    value={profileData.dateOfBirth}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="gender">Gender</label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={profileData.gender}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="bloodGroup">Blood Group</label>
                                <select
                                    id="bloodGroup"
                                    name="bloodGroup"
                                    value={profileData.bloodGroup}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                >
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
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
                        </div>

                        <div className="section-title">Emergency Contact</div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="emergency.name">Name</label>
                                <input
                                    type="text"
                                    id="emergency.name"
                                    name="emergency.name"
                                    value={profileData.emergencyContact.name}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="emergency.relationship">Relationship</label>
                                <input
                                    type="text"
                                    id="emergency.relationship"
                                    name="emergency.relationship"
                                    value={profileData.emergencyContact.relationship}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="emergency.phone">Phone Number</label>
                            <input
                                type="tel"
                                id="emergency.phone"
                                name="emergency.phone"
                                value={profileData.emergencyContact.phone}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="section-title">Medical Information</div>
                        <div className="form-group">
                            <label htmlFor="medicalHistory">Medical History</label>
                            <textarea
                                id="medicalHistory"
                                name="medicalHistory"
                                value={profileData.medicalHistory}
                                onChange={handleChange}
                                disabled={!isEditing}
                                rows="4"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="allergies">Allergies</label>
                            <textarea
                                id="allergies"
                                name="allergies"
                                value={profileData.allergies}
                                onChange={handleChange}
                                disabled={!isEditing}
                                rows="2"
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

export default PatientProfile; 