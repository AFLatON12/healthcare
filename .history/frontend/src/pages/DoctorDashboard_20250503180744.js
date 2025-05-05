import React from 'react';
import { Typography, Container, Box } from '@mui/material';

function DoctorDashboard() {
  return (
    <Container maxWidth="md">
      <Box mt={8} textAlign="center">
        <Typography variant="h4" gutterBottom>
          Welcome to the Doctor Dashboard
        </Typography>
        <Typography variant="body1">
          This is the doctor dashboard.
        </Typography>
      </Box>
    </Container>
  );
}

export default DoctorDashboard;
