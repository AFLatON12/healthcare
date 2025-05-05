import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, Paper } from '@mui/material';
import './AdminDashboard.css';

const AdminDashboard = ({ userPermissions = [] }) => {
  const [activeSection, setActiveSection] = useState('');

  const renderContent = () => {
    switch (activeSection) {
      case 'adminManagement':
        return userPermissions.includes('admin:list') ? (
          <Typography variant="h6">Admin Management Section</Typography>
        ) : (
          <Typography variant="h6" color="error">You do not have permission to view this section.</Typography>
        );
      case 'doctorManagement':
        return userPermissions.includes('doctor:list') ? (
          <Typography variant="h6">Doctor Management Section</Typography>
        ) : (
          <Typography variant="h6" color="error">You do not have permission to view this section.</Typography>
        );
      case 'patientManagement':
        return userPermissions.includes('patient:list') ? (
          <Typography variant="h6">Patient Management Section</Typography>
        ) : (
          <Typography variant="h6" color="error">You do not have permission to view this section.</Typography>
        );
      case 'systemManagement':
        return userPermissions.includes('system:config') ? (
          <Typography variant="h6">System Management Section</Typography>
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
      </Paper>
      <Box className="content">
        {renderContent()}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
