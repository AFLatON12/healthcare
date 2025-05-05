import React, { useState, useEffect } from 'react';
import { Typography, Container, Box, CircularProgress, Alert, List, ListItem, ListItemText } from '@mui/material';

function SuperAdminDashboard() {
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingDoctors = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/v1/doctors/pending', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Failed to fetch pending doctors: ${text}`);
        }
        const data = await response.json();
        setPendingDoctors(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingDoctors();
  }, []);

  return (
    <Container maxWidth="md">
      <Box mt={8} textAlign="center">
        <Typography variant="h4" gutterBottom>
          Welcome to the Super Admin Dashboard
        </Typography>
        <Typography variant="h6" gutterBottom>
          Pending Doctors
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : pendingDoctors.length === 0 ? (
          <Typography>No pending doctors found.</Typography>
        ) : (
          <List>
            {pendingDoctors.map((doctor) => (
              <ListItem key={doctor.id} divider>
                <ListItemText
                  primary={doctor.name}
                  secondary={doctor.specialization}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Container>
  );
}

export default SuperAdminDashboard;
