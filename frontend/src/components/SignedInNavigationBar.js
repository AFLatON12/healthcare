import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function SignedInNavigationBar({ onLogout }) {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Healthcare System
        </Typography>
        <Box>
          <Button color="inherit" onClick={() => handleNavigate('/appointments')}>
            Appointments
          </Button>
          <Button color="inherit" onClick={() => handleNavigate('/patient-dashboard')}>
            Dashboard
          </Button>
          <Button color="inherit" onClick={() => handleNavigate('/history')}>
            History
          </Button>
          <Button color="inherit" onClick={() => handleNavigate('/profile')}>
            Profile
          </Button>
          <Button color="inherit" onClick={onLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default SignedInNavigationBar;
