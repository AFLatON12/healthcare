import React, { useState } from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import './PatientDashboard.css';

const PatientDashboard = () => {
  const [activeSection, setActiveSection] = useState('appointments');

  const handleButtonClick = (section) => {
    setActiveSection(section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'appointments':
        return <Typography>Appointments Section</Typography>;
      case 'profile':
        return <Typography>Profile Section</Typography>;
      case 'prescriptions':
        return <Typography>Prescriptions Section</Typography>;
      default:
        return <Typography>Welcome to the Patient Dashboard</Typography>;
    }
  };

  return (
    <Box className="dashboard-container">
      <Paper className="sidebar" elevation={3}>
        <Typography variant="h5" className="sidebar-title">Patient Dashboard</Typography>
        <Button fullWidth onClick={() => handleButtonClick('appointments')} className="sidebar-button">
          Appointments
        </Button>
        <Button fullWidth onClick={() => handleButtonClick('profile')} className="sidebar-button">
          Profile
        </Button>
        <Button fullWidth onClick={() => handleButtonClick('prescriptions')} className="sidebar-button">
          Prescriptions
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
    </Box>
  );
};

export default PatientDashboard;
