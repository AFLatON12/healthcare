import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button, CircularProgress, Alert, Box, Paper, Snackbar, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './DoctorDashboard.css';
import DoctorScheduleManagement from '../components/DoctorScheduleManagement';
import PrescriptionManagement from '../components/PrescriptionManagement';

const DoctorDashboardNewV2 = ({ userPermissions = [] }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('appointments');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [editMode, setEditMode] = useState(false);
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

  console.log('Doctor ID:', doctorId);
  console.log('Token:', token);

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

const fetchDoctorProfile = async () => {
    try {
      setProfileLoading(true);
      const response = await axios.get(`http://localhost:8000/api/v1/doctors/${doctorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDoctorProfile(response.data);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setProfileError('Access denied. Please check your permissions.');
      } else {
        setProfileError('Failed to fetch doctor profile');
      }
    } finally {
      setProfileLoading(false);
    }
  };

  const updateDoctorProfile = async () => {
    try {
      await axios.put(`http://localhost:8000/api/v1/doctors/${doctorId}`, doctorProfile, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSnackbarMessage('Profile updated successfully');
      setSnackbarOpen(true);
      setEditMode(false);
    } catch (err) {
      setSnackbarMessage('Failed to update profile');
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    if (activeSection === 'profile' && doctorId && token) {
      fetchDoctorProfile();
    }
  }, [activeSection, doctorId, token]);

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

  const handleButtonClick = (section) => {
    setActiveSection(section);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const renderProfileFields = () => {
    const fields = [
      { label: 'Name', key: 'name' },
      { label: 'Email', key: 'email', readOnly: true },
      { label: 'Phone', key: 'phone' },
      { label: 'Specialization', key: 'specialization' },
      { label: 'Address', key: 'address' },
      { label: 'License Number', key: 'licenseNumber' },
      { label: 'Experience', key: 'experience' },
    ];

    return fields.map((field) => (
      <TextField
        key={field.key}
        label={field.label}
        value={doctorProfile?.[field.key] || ''}
        onChange={(e) =>
          !field.readOnly &&
          setDoctorProfile({ ...doctorProfile, [field.key]: e.target.value })
        }
        InputProps={{ readOnly: field.readOnly || !editMode }}
        fullWidth
        margin="normal"
      />
    ));
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'appointments':
        return (
          <>
            {loading ? (
              <CircularProgress />
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : appointments.length === 0 ? (
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
          </>
        );
      case 'profile':
        return profileLoading ? (
          <CircularProgress />
        ) : profileError ? (
          <Alert severity="error">{profileError}</Alert>
        ) : (
          <Box>
            {renderProfileFields()}
            {editMode ? (
              <>
                <Button onClick={updateDoctorProfile} variant="contained" color="primary">
                  Save
                </Button>
                <Button onClick={() => setEditMode(false)} variant="outlined" color="secondary">
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setEditMode(true)} variant="contained" color="primary">
                Edit
              </Button>
            )}
          </Box>
        );
      case 'schedule':
        return <DoctorScheduleManagement />;
      case 'prescriptions':
        return <PrescriptionManagement />;
      default:
        return <Typography variant="h6">Welcome to the Doctor Dashboard</Typography>;
    }
  };

  return (
    <Box className="dashboard-container">
      <Paper className="sidebar" elevation={3}>
        <Typography variant="h5" className="sidebar-title">Doctor Dashboard</Typography>
        <Button fullWidth onClick={() => handleButtonClick('appointments')} className="sidebar-button">
          Appointments
        </Button>
        <Button fullWidth onClick={() => handleButtonClick('profile')} className="sidebar-button">
          Profile
        </Button>
        <Button fullWidth onClick={() => handleButtonClick('schedule')} className="sidebar-button">
          Schedule Management
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

export default DoctorDashboardNewV2;
