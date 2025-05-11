import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import PatientDashboard from '../pages/PatientDashboard';

export default function PatientDashboardWrapper() {
  const { userId } = useParams();
  try {
    const userString = localStorage.getItem('user');
    if (!userString) {
      console.error('User not found in localStorage');
      return <Navigate to="/login" />;
    }
    const user = JSON.parse(userString);
    const validId = user.normalizedId || user.id || user.ID || user._id || user.userId;
    if (!validId) {
      console.error('User ID not found in user object');
      return <Navigate to="/login" />;
    }
    if (user.role !== 'patient' || validId !== userId) {
      console.error('User role mismatch or userId param mismatch');
      return <Navigate to="/" />;
    }
    return <PatientDashboard patientId={userId} />;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return <Navigate to="/login" />;
  }
}
