import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, Paper } from '@mui/material';
import './AdminDashboard.css';
import AdminManagement from '../components/AdminManagement';
import DoctorManagement from '../components/DoctorManagement';
import PatientManagement from '../components/PatientManagement';
import SystemManagement from '../components/SystemManagement';
import HealthCheck from '../components/HealthCheck';

const AdminDashboard = ({ userPermissions = [] }) => {
  console.log('AdminDashboard userPermissions:', userPermissions);
  const [activeSection, setActiveSection] = useState('adminManagement');

  const renderContent = () => {
    switch (activeSection) {
      case 'adminManagement':
        return userPermissions.includes('admin:list') ? (
          <AdminManagement userPermissions={userPermissions} />
        ) : (
          <Typography variant="h6" color="error">You do not have permission to view this section.</Typography>
        );
      case 'doctorManagement':
        return userPermissions.includes('doctor:list') ? (
          <DoctorManagement userPermissions={userPermissions} />
        ) : (
          <Typography variant="h6" color="error">You do not have permission to view this section.</Typography>
        );
      case 'patientManagement':
        return userPermissions.includes('patient:list') ? (
          <PatientManagement userPermissions={userPermissions} />
        ) : (
          <Typography variant="h6" color="error">You do not have permission to view this section.</Typography>
        );
      case 'systemManagement':
        return userPermissions.includes('system:config') ? (
          <SystemManagement userPermissions={userPermissions} />
        ) : (
          <Typography variant="h6" color="error">You do not have permission to view this section.</Typography>
        );
      default:
        return <Typography variant="h6">Welcome to the Admin Dashboard</Typography>;
    }
  };

  return (
    <Box className="dashboard-container">
      <Paper className="sidebar" elevation={3}>
        <Typography variant="h5" className="sidebar-title">Admin Dashboard</Typography>
        {userPermissions.length === 0 && (
          <Typography variant="body1" color="error" sx={{ p: 2 }}>
            No permissions assigned. Please contact your administrator.
          </Typography>
        )}
        {userPermissions.includes('admin:list') && (
          <Button fullWidth onClick={() => setActiveSection('adminManagement')} className="sidebar-button">
            Admin Management
          </Button>
        )}
        {userPermissions.includes('doctor:list') && (
          <Button fullWidth onClick={() => setActiveSection('doctorManagement')} className="sidebar-button">
            Doctor Management
          </Button>
        )}
        {userPermissions.includes('patient:list') && (
          <Button fullWidth onClick={() => setActiveSection('patientManagement')} className="sidebar-button">
            Patient Management
          </Button>
        )}
        {userPermissions.includes('system:config') && (
          <Button fullWidth onClick={() => setActiveSection('systemManagement')} className="sidebar-button">
            System Management
          </Button>
        )}
      <Button
        fullWidth
        variant="contained"
        color="error"
        onClick={() => {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }}
        className="sidebar-button"
        sx={{ mt: 2 }}
      >
        Sign Out
      </Button>
      </Paper>
      <Box className="content">
        {renderContent()}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
