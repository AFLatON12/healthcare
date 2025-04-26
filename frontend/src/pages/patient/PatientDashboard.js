import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/PatientDashboard.css';

const PatientDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');

    // Mock data for demonstration
    const upcomingAppointments = [
        { id: 1, doctorName: 'Dr. Sarah Wilson', time: '10:00 AM', date: '2024-03-20', type: 'Regular Checkup' },
        { id: 2, doctorName: 'Dr. Michael Brown', time: '2:30 PM', date: '2024-03-22', type: 'Follow-up' }
    ];

    const recentPrescriptions = [
        { id: 1, doctorName: 'Dr. Sarah Wilson', date: '2024-03-15', medications: ['Amoxicillin', 'Ibuprofen'] },
        { id: 2, doctorName: 'Dr. Michael Brown', date: '2024-03-10', medications: ['Paracetamol'] }
    ];

    return (
        <div className="patient-dashboard">
            <div className="dashboard-header">
                <h1>Patient Dashboard</h1>
                <div className="header-actions">
                    <Link to="/patient/profile" className="profile-link">View Profile</Link>
                    <button className="logout-btn">Logout</button>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="sidebar">
                    <nav>
                        <button
                            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                            onClick={() => setActiveTab('overview')}
                        >
                            Overview
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'appointments' ? 'active' : ''}`}
                            onClick={() => setActiveTab('appointments')}
                        >
                            Appointments
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'prescriptions' ? 'active' : ''}`}
                            onClick={() => setActiveTab('prescriptions')}
                        >
                            Prescriptions
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'messages' ? 'active' : ''}`}
                            onClick={() => setActiveTab('messages')}
                        >
                            Messages
                        </button>
                    </nav>
                </div>

                <div className="main-content">
                    {activeTab === 'overview' && (
                        <div className="overview-section">
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <h3>Upcoming Appointments</h3>
                                    <p className="stat-number">2</p>
                                </div>
                                <div className="stat-card">
                                    <h3>Active Prescriptions</h3>
                                    <p className="stat-number">3</p>
                                </div>
                                <div className="stat-card">
                                    <h3>Unread Messages</h3>
                                    <p className="stat-number">1</p>
                                </div>
                            </div>

                            <div className="upcoming-appointments">
                                <h2>Upcoming Appointments</h2>
                                <div className="appointments-list">
                                    {upcomingAppointments.map(appointment => (
                                        <div key={appointment.id} className="appointment-card">
                                            <div className="appointment-info">
                                                <h4>{appointment.doctorName}</h4>
                                                <p>{appointment.type}</p>
                                                <p>{appointment.date} at {appointment.time}</p>
                                            </div>
                                            <div className="appointment-actions">
                                                <button className="action-btn">View Details</button>
                                                <button className="cancel-btn">Cancel</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="recent-prescriptions">
                                <h2>Recent Prescriptions</h2>
                                <div className="prescriptions-list">
                                    {recentPrescriptions.map(prescription => (
                                        <div key={prescription.id} className="prescription-card">
                                            <div className="prescription-info">
                                                <h4>{prescription.doctorName}</h4>
                                                <p>Date: {prescription.date}</p>
                                                <div className="medications">
                                                    {prescription.medications.map((med, index) => (
                                                        <span key={index} className="medication-tag">{med}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <button className="view-btn">View Details</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'appointments' && (
                        <div className="appointments-section">
                            <h2>Appointments</h2>
                            {/* Appointments content will go here */}
                        </div>
                    )}

                    {activeTab === 'prescriptions' && (
                        <div className="prescriptions-section">
                            <h2>Prescriptions</h2>
                            {/* Prescriptions content will go here */}
                        </div>
                    )}

                    {activeTab === 'messages' && (
                        <div className="messages-section">
                            <h2>Messages</h2>
                            {/* Messages content will go here */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard; 