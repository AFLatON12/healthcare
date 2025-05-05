import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const DoctorDashboardNewV2 = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Updated to get userId from stored user object in localStorage
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  let doctorId = null;
  if (user) {
    try {
      const userObj = JSON.parse(user);
      doctorId = userObj._id || userObj.id || null;
    } catch {
      doctorId = null;
    }
  }

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8080/api/appointments/doctor/${doctorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAppointments(response.data);
      } catch (err) {
        setError('Failed to fetch appointments');
      } finally {
        setLoading(false);
      }
    };

    if (doctorId && token) {
      fetchAppointments();
    } else {
      setError('User not authenticated');
      setLoading(false);
    }
  }, [doctorId, token]);

  const updateAppointmentStatus = async (id, action, data = {}) => {
    try {
      await axios.put(
        `http://localhost:8080/api/appointments/${id}/${action}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refresh appointments after update
      const response = await axios.get(
        `http://localhost:8080/api/appointments/doctor/${doctorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAppointments(response.data);
    } catch (err) {
      setError('Failed to update appointment');
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Doctor Dashboard
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/doctor/profile')}
        sx={{ mb: 2 }}
      >
        View/Edit Profile
      </Button>
      {appointments.length === 0 ? (
        <Typography>No appointments found.</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient ID</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appt) => (
              <TableRow key={appt._id}>
                <TableCell>{appt.patientId}</TableCell>
                <TableCell>{new Date(appt.startTime).toLocaleString()}</TableCell>
                <TableCell>{new Date(appt.endTime).toLocaleString()}</TableCell>
                <TableCell>{appt.status}</TableCell>
                <TableCell>{appt.notes}</TableCell>
                <TableCell>
                  {appt.status === 'pending' && (
                    <Button onClick={() => updateAppointmentStatus(appt._id, 'confirm')} variant="contained" color="primary">
                      Confirm
                    </Button>
                  )}
                  {appt.status === 'confirmed' && (
                    <>
                      <Button onClick={() => updateAppointmentStatus(appt._id, 'start')} variant="contained" color="secondary">
                        Start
                      </Button>
                      <Button onClick={() => updateAppointmentStatus(appt._id, 'cancel', { reason: 'Cancelled by doctor' })} variant="outlined" color="error">
                        Cancel
                      </Button>
                    </>
                  )}
                  {appt.status === 'confirmed' && (
                    <Button onClick={() => updateAppointmentStatus(appt._id, 'complete', { notes: 'Completed successfully' })} variant="contained" color="success">
                      Complete
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Container>
  );
};

export default DoctorDashboardNewV2;
