import React, { useState } from 'react';
import { Button, Typography, Box, Paper } from '@mui/material';
import AdminManagement from '../components/AdminManagement';
import DoctorManagement from '../components/DoctorManagement';
import PatientManagement from '../components/PatientManagement';
import SystemManagement from '../components/SystemManagement';
import HealthCheck from '../components/HealthCheck';
import './SuperAdminDashboard.css';

const SuperAdminDashboard = ({ userPermissions }) => {
  const [activeSection, setActiveSection] = useState('');

  const renderContent = () => {
    switch (activeSection) {
      case 'adminManagement':
        return <AdminManagement userPermissions={userPermissions} />;
      case 'doctorManagement':
        return <DoctorManagement userPermissions={userPermissions} />;
      case 'patientManagement':
        return <PatientManagement userPermissions={userPermissions} />;
      case 'systemManagement':
        return <SystemManagement userPermissions={userPermissions} />;
      case 'healthCheck':
        return <HealthCheck />;
      default:
        return <Typography variant="h6">Welcome to the Super Admin Dashboard</Typography>;
    }
  };

  return (
    <Box className="dashboard-container">
      <Paper className="sidebar" elevation={3}>
        <Typography variant="h5" className="sidebar-title">Super Admin Dashboard</Typography>
        <Button fullWidth onClick={() => setActiveSection('adminManagement')} className="sidebar-button">
          Admin Management
        </Button>
        <Button fullWidth onClick={() => setActiveSection('doctorManagement')} className="sidebar-button">
          Doctor Management
        </Button>
        <Button fullWidth onClick={() => setActiveSection('patientManagement')} className="sidebar-button">
          Patient Management
        </Button>
        <Button fullWidth onClick={() => setActiveSection('systemManagement')} className="sidebar-button">
          System Management
        </Button>
        <Button fullWidth onClick={() => setActiveSection('healthCheck')} className="sidebar-button">
          Health Check
        </Button>
      </Paper>
      <Box className="content">
        {renderContent()}
      </Box>
    </Box>
  );
};

export default SuperAdminDashboard;
