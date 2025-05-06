import React, { useState } from 'react';
import { Button, Typography, Box, Paper, Snackbar, Alert } from '@mui/material';
import './AdminDashboard.css';
import AdminManagement from '../components/AdminManagement';
import DoctorManagement from '../components/DoctorManagement';
import PatientManagement from '../components/PatientManagement';
import SystemManagement from '../components/SystemManagement';
import HealthCheck from '../components/HealthCheck';
import Transactions from './Transactions';

const AdminDashboard = ({ userPermissions = [] }) => {
  const [activeSection, setActiveSection] = useState('adminManagement');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const hasAnyPermission = (permissions) => permissions.some((perm) => userPermissions.includes(perm));

  const handleButtonClick = (section, permissions) => {
    if (hasAnyPermission(permissions) || permissions.length === 0) {
      setActiveSection(section);
    } else {
      setSnackbarMessage('You do not have permission to access this section.');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'adminManagement':
        return hasAnyPermission(['admin:create', 'admin:list', 'admin:view', 'admin:update', 'admin:delete']) ? (
          <AdminManagement userPermissions={userPermissions} />
        ) : (
          <Typography variant="h6" color="error">You do not have permission to view this section.</Typography>
        );
      case 'doctorManagement':
        return hasAnyPermission(['doctor:list']) ? (
          <DoctorManagement userPermissions={userPermissions} />
        ) : (
          <Typography variant="h6" color="error">You do not have permission to view this section.</Typography>
        );
      case 'patientManagement':
        return hasAnyPermission(['patient:list']) ? (
          <PatientManagement userPermissions={userPermissions} />
        ) : (
          <Typography variant="h6" color="error">You do not have permission to view this section.</Typography>
        );
      case 'systemManagement':
        return hasAnyPermission(['system:config']) ? (
          <SystemManagement userPermissions={userPermissions} />
        ) : (
          <Typography variant="h6" color="error">You do not have permission to view this section.</Typography>
        );
      case 'healthCheck':
        return <HealthCheck />;
      case 'transactions':
        return <Transactions />;
      default:
        return <Typography variant="h6">Welcome to the Admin Dashboard</Typography>;
    }
  };

  return (
    <Box className="dashboard-container">
      <Paper className="sidebar" elevation={3}>
        <Typography variant="h5" className="sidebar-title">Admin Dashboard</Typography>
        <Button
          fullWidth
          onClick={() => handleButtonClick('adminManagement', ['admin:create', 'admin:list', 'admin:view', 'admin:update', 'admin:delete'])}
          disabled={!hasAnyPermission(['admin:create', 'admin:list', 'admin:view', 'admin:update', 'admin:delete'])}
          className="sidebar-button"
        >
          Admin Management
        </Button>
        <Button
          fullWidth
          onClick={() => handleButtonClick('doctorManagement', ['doctor:list'])}
          disabled={!hasAnyPermission(['doctor:list'])}
          className="sidebar-button"
        >
          Doctor Management
        </Button>
        <Button
          fullWidth
          onClick={() => handleButtonClick('patientManagement', ['patient:list'])}
          disabled={!hasAnyPermission(['patient:list'])}
          className="sidebar-button"
        >
          Patient Management
        </Button>
        <Button
          fullWidth
          onClick={() => handleButtonClick('systemManagement', ['system:config'])}
          disabled={!hasAnyPermission(['system:config'])}
          className="sidebar-button"
        >
          System Management
        </Button>
        <Button
          fullWidth
          onClick={() => handleButtonClick('healthCheck', [])}
          className="sidebar-button"
        >
          Health Check
        </Button>
        <Button
          fullWidth
          onClick={() => setActiveSection('transactions')}
          className="sidebar-button"
        >
          Transactions
        </Button>
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminDashboard;
