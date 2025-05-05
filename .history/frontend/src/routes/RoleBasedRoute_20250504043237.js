import React from 'react';
import { Navigate } from 'react-router-dom';

export default function RoleBasedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  if (!token || !userStr) return <Navigate to="/login" />;
  try {
    const user = JSON.parse(userStr);
    return allowedRoles.includes(user.role) ? children : <Navigate to="/" />;
  } catch {
    return <Navigate to="/login" />;
  }
}
