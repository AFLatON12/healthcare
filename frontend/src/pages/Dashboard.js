import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { appointmentService, transactionService } from '../services/api';

const Dashboard = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [appointmentsData, transactionsData] = await Promise.all([
                    appointmentService.getAppointments(),
                    transactionService.getTransactions(),
                ]);

                setAppointments(appointmentsData);
                setTransactions(transactionsData);
            } catch (err) {
                setError('Failed to fetch dashboard data');
                console.error('Dashboard data fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    const upcomingAppointments = appointments
        .filter((apt) => new Date(apt.date) > new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);

    const recentTransactions = transactions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-white shadow rounded-lg p-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    Welcome back, {user?.name || 'User'}!
                </h1>
                <p className="mt-1 text-gray-500">
                    Here's an overview of your healthcare information
                </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                    to="/appointments/create"
                    className="bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-lg shadow text-center"
                >
                    <h3 className="text-lg font-semibold">Book Appointment</h3>
                    <p className="mt-2">Schedule a new appointment with a doctor</p>
                </Link>
                <Link
                    to="/prescriptions"
                    className="bg-green-500 hover:bg-green-600 text-white p-6 rounded-lg shadow text-center"
                >
                    <h3 className="text-lg font-semibold">View Prescriptions</h3>
                    <p className="mt-2">Check your current prescriptions</p>
                </Link>
                <Link
                    to="/transactions"
                    className="bg-purple-500 hover:bg-purple-600 text-white p-6 rounded-lg shadow text-center"
                >
                    <h3 className="text-lg font-semibold">Payment History</h3>
                    <p className="mt-2">View your transaction history</p>
                </Link>
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Upcoming Appointments
                    </h2>
                    <Link
                        to="/appointments"
                        className="text-blue-500 hover:text-blue-600"
                    >
                        View all
                    </Link>
                </div>
                {upcomingAppointments.length > 0 ? (
                    <div className="space-y-4">
                        {upcomingAppointments.map((appointment) => (
                            <div
                                key={appointment.id}
                                className="border rounded-lg p-4 hover:bg-gray-50"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-medium">
                                            Dr. {appointment.doctorName}
                                        </h3>
                                        <p className="text-gray-500">
                                            {new Date(appointment.date).toLocaleDateString()}{' '}
                                            {new Date(appointment.date).toLocaleTimeString()}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm ${appointment.status === 'confirmed'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}
                                    >
                                        {appointment.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No upcoming appointments</p>
                )}
            </div>

            {/* Recent Transactions */}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Recent Transactions
                    </h2>
                    <Link
                        to="/transactions"
                        className="text-blue-500 hover:text-blue-600"
                    >
                        View all
                    </Link>
                </div>
                {recentTransactions.length > 0 ? (
                    <div className="space-y-4">
                        {recentTransactions.map((transaction) => (
                            <div
                                key={transaction.id}
                                className="border rounded-lg p-4 hover:bg-gray-50"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-medium">
                                            {transaction.description}
                                        </h3>
                                        <p className="text-gray-500">
                                            {new Date(transaction.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">
                                            ${transaction.amount.toFixed(2)}
                                        </p>
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm ${transaction.status === 'completed'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                }`}
                                        >
                                            {transaction.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No recent transactions</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard; 