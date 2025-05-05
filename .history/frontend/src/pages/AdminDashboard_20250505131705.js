import React, { useState } from 'react';
import { Button, Typography, Box, Grid, Paper } from '@mui/material';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('adminManagement');

  const renderContent = () => {
    switch (activeSection) {
      case 'adminManagement':
        return <Typography variant="h6">Admin Management Section</Typography>;
      case 'doctorManagement':
        return <Typography variant="h6">Doctor Management Section</Typography>;
      case 'patientManagement':
        return <Typography variant="h6">Patient Management Section</Typography>;
      case 'systemManagement':
        return <Typography variant="h6">System Management Section</Typography>;
      default:
        return <Typography variant="h6">Welcome to the Admin Dashboard</Typography>;
    }
  };

  return (
    <Box className="dashboard-container">
      <Paper className="sidebar" elevation={3}>
        <Typography variant="h5" className="sidebar-title">Admin Dashboard</Typography>
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
      </Paper>
      <Box className="content">
        {renderContent()}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
