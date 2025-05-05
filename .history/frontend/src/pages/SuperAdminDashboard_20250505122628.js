import React, { useState, useEffect } from 'react';
import { Typography, Container, Box, CircularProgress, Alert, Card, CardContent } from '@mui/material';
import Grid from '@mui/material/Grid';

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
        const response = await fetch('http://localhost:8000/api/v1/doctors/pending', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Failed to fetch pending doctors: ${text}`);
        }
        const data = await response.json();
        console.log('Fetched pending doctors:', data);
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
    <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
      <Typography variant="h3" gutterBottom align="center">
        Super Admin Dashboard
      </Typography>
      <Typography variant="h5" gutterBottom align="center" color="textSecondary">
        Pending Doctors
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      ) : pendingDoctors.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          No pending doctors found.
        </Typography>
      ) : (
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {pendingDoctors.map((doctor) => (
            <Grid xs={12} sm={6} md={4} key={doctor.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    {doctor.name}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {doctor.specialization}
                  </Typography>
                  {/* Additional doctor info can be added here */}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default SuperAdminDashboard;
