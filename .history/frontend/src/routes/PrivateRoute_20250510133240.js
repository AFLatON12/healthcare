import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  const patientId = localStorage.getItem('patientId');
  return token && patientId ? children : <Navigate to="/login" />;
}
