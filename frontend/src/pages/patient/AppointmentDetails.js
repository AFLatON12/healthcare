import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../styles/AppointmentDetails.css';

const AppointmentDetails = () => {
    const { id } = useParams();
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // TODO: Fetch appointment details from API
        // For now, using mock data
        const mockAppointment = {
            id: id,
            doctorName: 'Dr. Sarah Wilson',
            doctorSpecialty: 'Cardiologist',
            date: '2024-03-20',
            time: '10:00 AM',
            status: 'confirmed',
            type: 'Regular Checkup',
            location: 'Medical Center, Room 205',
            notes: 'Regular heart checkup and blood pressure monitoring',
            patientSymptoms: 'Occasional chest pain and shortness of breath',
            previousVisit: '2024-02-15',
            duration: '30 minutes',
            cost: '$150',
            insuranceCovered: true,
            doctorImage: 'https://example.com/doctor-image.jpg',
            documents: [
                { name: 'Previous Test Results', url: '#' },
                { name: 'Medical History', url: '#' }
            ]
        };

        setTimeout(() => {
            setAppointment(mockAppointment);
            setLoading(false);
        }, 1000);
    }, [id]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading appointment details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p className="error-message">{error}</p>
                <Link to="/patient/dashboard" className="back-link">Back to Dashboard</Link>
            </div>
        );
    }

    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case 'confirmed':
                return 'status-confirmed';
            case 'pending':
                return 'status-pending';
            case 'cancelled':
                return 'status-cancelled';
            case 'completed':
                return 'status-completed';
            default:
                return '';
        }
    };

    return (
        <div className="appointment-details-container">
            <div className="appointment-details-header">
                <Link to="/patient/dashboard" className="back-button">
                    ← Back to Dashboard
                </Link>
                <h1>Appointment Details</h1>
            </div>

            <div className="appointment-details-content">
                <div className="appointment-main-info">
                    <div className="doctor-info">
                        <div className="doctor-image">
                            <img src={appointment.doctorImage} alt={appointment.doctorName} />
                        </div>
                        <div className="doctor-details">
                            <h2>{appointment.doctorName}</h2>
                            <p className="specialty">{appointment.doctorSpecialty}</p>
                        </div>
                    </div>

                    <div className="appointment-status">
                        <span className={`status-badge ${getStatusClass(appointment.status)}`}>
                            {appointment.status}
                        </span>
                    </div>
                </div>

                <div className="appointment-info-grid">
                    <div className="info-card">
                        <h3>Date & Time</h3>
                        <p>{appointment.date}</p>
                        <p>{appointment.time}</p>
                        <p>Duration: {appointment.duration}</p>
                    </div>

                    <div className="info-card">
                        <h3>Location</h3>
                        <p>{appointment.location}</p>
                    </div>

                    <div className="info-card">
                        <h3>Appointment Type</h3>
                        <p>{appointment.type}</p>
                    </div>

                    <div className="info-card">
                        <h3>Cost Information</h3>
                        <p>Fee: {appointment.cost}</p>
                        <p>Insurance Covered: {appointment.insuranceCovered ? 'Yes' : 'No'}</p>
                    </div>
                </div>

                <div className="appointment-details-section">
                    <h3>Notes</h3>
                    <p>{appointment.notes}</p>
                </div>

                <div className="appointment-details-section">
                    <h3>Patient Symptoms</h3>
                    <p>{appointment.patientSymptoms}</p>
                </div>

                <div className="appointment-details-section">
                    <h3>Related Documents</h3>
                    <div className="documents-list">
                        {appointment.documents.map((doc, index) => (
                            <a key={index} href={doc.url} className="document-link">
                                {doc.name}
                            </a>
                        ))}
                    </div>
                </div>

                <div className="appointment-actions">
                    <button className="action-button reschedule">Reschedule Appointment</button>
                    <button className="action-button cancel">Cancel Appointment</button>
                </div>
            </div>
        </div>
    );
};

export default AppointmentDetails; 