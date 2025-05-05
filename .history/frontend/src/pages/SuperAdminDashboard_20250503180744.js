import React from 'react';
import { Typography, Container, Box } from '@mui/material';

function SuperAdminDashboard() {
  return (
    <Container maxWidth="md">
      <Box mt={8} textAlign="center">
        <Typography variant="h4" gutterBottom>
          Welcome to the Super Admin Dashboard
        </Typography>
        <Typography variant="body1">
          This is the super admin dashboard.
        </Typography>
      </Box>
    </Container>
  );
}

export default SuperAdminDashboard;
