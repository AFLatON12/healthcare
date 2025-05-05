import React from 'react';
import { Navigate } from 'react-router-dom';

import React from 'react';
import { Navigate } from 'react-router-dom';

export default function RoleBasedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  if (!token || !userStr) return <Navigate to="/login" />;
  try {
    const user = JSON.parse(userStr);
    if (allowedRoles.includes(user.role)) {
      return children;
    } else {
      return <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Not Authorized</h2>
        <p>You do not have permission to view this page.</p>
      </div>;
    }
  } catch {
    return <Navigate to="/login" />;
  }
}
