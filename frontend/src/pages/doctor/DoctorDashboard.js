import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/DoctorDashboard.css';

const DoctorDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');

    // Mock data for demonstration
    const upcomingAppointments = [
        { id: 1, patientName: 'John Doe', time: '10:00 AM', date: '2024-03-20', type: 'Regular Checkup' },
        { id: 2, patientName: 'Jane Smith', time: '11:30 AM', date: '2024-03-20', type: 'Follow-up' },
        { id: 3, patientName: 'Mike Johnson', time: '2:00 PM', date: '2024-03-20', type: 'Consultation' }
    ];

    const recentMessages = [
        { id: 1, sender: 'Sarah Wilson', message: 'Regarding my test results...', time: '2 hours ago' },
        { id: 2, sender: 'David Brown', message: 'Can we reschedule my appointment?', time: '5 hours ago' }
    ];

    return (
        <div className="doctor-dashboard">
            <div className="dashboard-header">
                <h1>Doctor Dashboard</h1>
                <div className="header-actions">
                    <Link to="/doctor/profile" className="profile-link">View Profile</Link>
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
                            className={`nav-item ${activeTab === 'messages' ? 'active' : ''}`}
                            onClick={() => setActiveTab('messages')}
                        >
                            Messages
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'prescriptions' ? 'active' : ''}`}
                            onClick={() => setActiveTab('prescriptions')}
                        >
                            Prescriptions
                        </button>
                    </nav>
                </div>

                <div className="main-content">
                    {activeTab === 'overview' && (
                        <div className="overview-section">
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <h3>Today's Appointments</h3>
                                    <p className="stat-number">5</p>
                                </div>
                                <div className="stat-card">
                                    <h3>Pending Messages</h3>
                                    <p className="stat-number">3</p>
                                </div>
                                <div className="stat-card">
                                    <h3>Total Patients</h3>
                                    <p className="stat-number">120</p>
                                </div>
                            </div>

                            <div className="upcoming-appointments">
                                <h2>Upcoming Appointments</h2>
                                <div className="appointments-list">
                                    {upcomingAppointments.map(appointment => (
                                        <div key={appointment.id} className="appointment-card">
                                            <div className="appointment-info">
                                                <h4>{appointment.patientName}</h4>
                                                <p>{appointment.type}</p>
                                                <p>{appointment.date} at {appointment.time}</p>
                                            </div>
                                            <div className="appointment-actions">
                                                <button className="action-btn">View Details</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="recent-messages">
                                <h2>Recent Messages</h2>
                                <div className="messages-list">
                                    {recentMessages.map(message => (
                                        <div key={message.id} className="message-card">
                                            <div className="message-info">
                                                <h4>{message.sender}</h4>
                                                <p>{message.message}</p>
                                                <span className="message-time">{message.time}</span>
                                            </div>
                                            <button className="reply-btn">Reply</button>
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

                    {activeTab === 'messages' && (
                        <div className="messages-section">
                            <h2>Messages</h2>
                            {/* Messages content will go here */}
                        </div>
                    )}

                    {activeTab === 'prescriptions' && (
                        <div className="prescriptions-section">
                            <h2>Prescriptions</h2>
                            {/* Prescriptions content will go here */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard; 