import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function SignedOutNavigationBar() {
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
          <Button color="inherit" onClick={() => handleNavigate('/')}>
            Home
          </Button>
          <Button color="inherit" onClick={() => handleNavigate('/login')}>
            Sign In
          </Button>
          <Button color="inherit" onClick={() => handleNavigate('/signup')}>
            Sign Up
          </Button>
          <Button color="inherit" onClick={() => handleNavigate('/join-doctor')}>
            Join as Doctor
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default SignedOutNavigationBar;
