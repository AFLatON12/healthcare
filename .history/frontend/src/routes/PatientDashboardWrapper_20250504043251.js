import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import PatientDashboard from '../pages/PatientDashboard';

export default function PatientDashboardWrapper() {
  const { userId } = useParams();
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const validId = user.normalizedId || user.id || user.ID || user._id || user.userId;
    if (user.role !== 'patient' || validId !== userId) {
      return <Navigate to="/" />;
    }
    return <PatientDashboard patientId={userId} />;
  } catch {
    return <Navigate to="/login" />;
  }
}
