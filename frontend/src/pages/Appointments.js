import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { appointmentService } from '../services/api';
import '../styles/Appointments.css';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all'); // all, upcoming, past
    const [activeTab, setActiveTab] = useState('upcoming');
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState('');

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const data = await appointmentService.getAppointments();
            setAppointments(data);
        } catch (err) {
            setError('Failed to fetch appointments');
            console.error('Appointments fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelAppointment = async (appointmentId) => {
        try {
            await appointmentService.updateAppointment(appointmentId, {
                status: 'cancelled',
            });
            fetchAppointments(); // Refresh the list
        } catch (err) {
            setError('Failed to cancel appointment');
            console.error('Cancel appointment error:', err);
        }
    };

    const filteredAppointments = appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.date);
        const now = new Date();

        switch (filter) {
            case 'upcoming':
                return appointmentDate > now;
            case 'past':
                return appointmentDate < now;
            default:
                return true;
        }
    });

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
                <Link
                    to="/appointments/create"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                    Book New Appointment
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white shadow rounded-lg p-4">
                <div className="flex space-x-4">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-md ${filter === 'all'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('upcoming')}
                        className={`px-4 py-2 rounded-md ${filter === 'upcoming'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => setFilter('past')}
                        className={`px-4 py-2 rounded-md ${filter === 'past'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Past
                    </button>
                </div>
            </div>

            {/* Appointments List */}
            <div className="bg-white shadow rounded-lg divide-y">
                {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((appointment) => (
                        <div
                            key={appointment.id}
                            className="p-6 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Dr. {appointment.doctorName}
                                    </h3>
                                    <p className="mt-1 text-gray-500">
                                        {new Date(appointment.date).toLocaleDateString()}{' '}
                                        {new Date(appointment.date).toLocaleTimeString()}
                                    </p>
                                    <p className="mt-1 text-gray-500">
                                        {appointment.specialization}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm ${appointment.status === 'confirmed'
                                                ? 'bg-green-100 text-green-800'
                                                : appointment.status === 'cancelled'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}
                                    >
                                        {appointment.status}
                                    </span>
                                    {appointment.status === 'confirmed' && (
                                        <button
                                            onClick={() => handleCancelAppointment(appointment.id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                            {appointment.notes && (
                                <p className="mt-4 text-gray-600">{appointment.notes}</p>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="p-6 text-center text-gray-500">
                        No appointments found
                    </div>
                )}
            </div>
        </div>
    );
};

export default Appointments; 