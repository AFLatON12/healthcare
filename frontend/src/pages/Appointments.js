import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Appointments.css';

const Appointments = () => {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState('');

    // Mock data for demonstration
    const upcomingAppointments = [
        {
            id: 1,
            doctorName: 'Dr. Sarah Wilson',
            patientName: 'John Doe',
            date: '2024-03-20',
            time: '10:00 AM',
            type: 'Regular Checkup',
            status: 'confirmed'
        },
        {
            id: 2,
            doctorName: 'Dr. Michael Brown',
            patientName: 'Jane Smith',
            date: '2024-03-22',
            time: '2:30 PM',
            type: 'Follow-up',
            status: 'pending'
        }
    ];

    const pastAppointments = [
        {
            id: 3,
            doctorName: 'Dr. Sarah Wilson',
            patientName: 'John Doe',
            date: '2024-03-15',
            time: '11:00 AM',
            type: 'Consultation',
            status: 'completed'
        }
    ];

    const availableDoctors = [
        { id: 1, name: 'Dr. Sarah Wilson', specialization: 'Cardiology' },
        { id: 2, name: 'Dr. Michael Brown', specialization: 'General Medicine' },
        { id: 3, name: 'Dr. Emily Davis', specialization: 'Pediatrics' }
    ];

    const availableTimeSlots = [
        '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM',
        '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM'
    ];

    const handleBookAppointment = (e) => {
        e.preventDefault();
        // TODO: Implement booking logic
        console.log('Booking appointment:', { selectedDate, selectedTime, selectedDoctor });
        setIsBookingModalOpen(false);
    };

    return (
        <div className="appointments-page">
            <div className="appointments-header">
                <h1>Appointments</h1>
                <button
                    className="book-appointment-btn"
                    onClick={() => setIsBookingModalOpen(true)}
                >
                    Book New Appointment
                </button>
            </div>

            <div className="appointments-tabs">
                <button
                    className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
                    onClick={() => setActiveTab('upcoming')}
                >
                    Upcoming
                </button>
                <button
                    className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`}
                    onClick={() => setActiveTab('past')}
                >
                    Past
                </button>
            </div>

            <div className="appointments-list">
                {activeTab === 'upcoming' ? (
                    upcomingAppointments.map(appointment => (
                        <div key={appointment.id} className="appointment-card">
                            <div className="appointment-info">
                                <h3>{appointment.doctorName}</h3>
                                <p className="appointment-type">{appointment.type}</p>
                                <p className="appointment-date">{appointment.date} at {appointment.time}</p>
                                <span className={`status-badge ${appointment.status}`}>
                                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                </span>
                            </div>
                            <div className="appointment-actions">
                                <button className="reschedule-btn">Reschedule</button>
                                <button className="cancel-btn">Cancel</button>
                            </div>
                        </div>
                    ))
                ) : (
                    pastAppointments.map(appointment => (
                        <div key={appointment.id} className="appointment-card">
                            <div className="appointment-info">
                                <h3>{appointment.doctorName}</h3>
                                <p className="appointment-type">{appointment.type}</p>
                                <p className="appointment-date">{appointment.date} at {appointment.time}</p>
                                <span className={`status-badge ${appointment.status}`}>
                                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                </span>
                            </div>
                            <div className="appointment-actions">
                                <button className="view-details-btn">View Details</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {isBookingModalOpen && (
                <div className="modal-overlay">
                    <div className="booking-modal">
                        <div className="modal-header">
                            <h2>Book New Appointment</h2>
                            <button
                                className="close-btn"
                                onClick={() => setIsBookingModalOpen(false)}
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleBookAppointment}>
                            <div className="form-group">
                                <label htmlFor="doctor">Select Doctor</label>
                                <select
                                    id="doctor"
                                    value={selectedDoctor}
                                    onChange={(e) => setSelectedDoctor(e.target.value)}
                                    required
                                >
                                    <option value="">Choose a doctor</option>
                                    {availableDoctors.map(doctor => (
                                        <option key={doctor.id} value={doctor.id}>
                                            {doctor.name} - {doctor.specialization}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="date">Select Date</label>
                                <input
                                    type="date"
                                    id="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="time">Select Time</label>
                                <select
                                    id="time"
                                    value={selectedTime}
                                    onChange={(e) => setSelectedTime(e.target.value)}
                                    required
                                >
                                    <option value="">Choose a time slot</option>
                                    {availableTimeSlots.map(time => (
                                        <option key={time} value={time}>{time}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-actions">
                                <button type="button" className="cancel-btn" onClick={() => setIsBookingModalOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="book-btn">
                                    Book Appointment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Appointments; 