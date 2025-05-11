import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  TextField,
  AppBar,
  Toolbar,
  Avatar,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
} from '@mui/material';
import {
  CalendarToday,
  Person,
  Schedule,
  Assignment,
  MonetizationOn,
  Logout,
  LocalHospital,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './DoctorDashboard.css';
import DoctorScheduleManagement from '../components/DoctorScheduleManagement';
import PrescriptionManagement from '../components/PrescriptionManagement';
import Transactions from './Transactions';
import DoctorTransactions from './DoctorTransactions';

const sidebarItems = [
  { key: 'appointments', label: 'Appointments', icon: <CalendarToday /> },
  { key: 'profile', label: 'Profile', icon: <Person /> },
  { key: 'schedule', label: 'Schedule Management', icon: <Schedule /> },
  { key: 'prescriptions', label: 'Prescriptions', icon: <Assignment /> },
  { key: 'transactions', label: 'Transactions', icon: <MonetizationOn /> },
];

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

  // Simulate doctor user info
  const doctorUser = {
    name: doctorProfile?.name || 'Doctor',
    email: doctorProfile?.email || 'doctor@healthcare.com',
    avatar: '',
  };

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

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8080/api/prescriptions/doctor/${doctorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAppointments(response.data);
    } catch (err) {
      setError('Failed to fetch prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const updatePrescriptionStatus = async (id, action, data = {}) => {
    try {
      await axios.put(
        `http://localhost:8080/api/prescriptions/${id}/${action}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refresh prescriptions after update
      fetchPrescriptions();
    } catch (err) {
      setError('Failed to update prescription');
    }
  };

  useEffect(() => {
    if (activeSection === 'prescriptions' && doctorId && token) {
      fetchPrescriptions();
    }
  }, [activeSection, doctorId, token]);

  const handleSidebarClick = (section) => {
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
          <Box>
            <Typography variant="h5" fontWeight={700} mb={2} className="text-blue-700">Appointments</Typography>
            {loading ? (
              <CircularProgress />
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : appointments.length === 0 ? (
              <Typography>No appointments found.</Typography>
            ) : (
              <Paper elevation={1} sx={{ overflowX: 'auto', mt: 2 }}>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {appointments.map((appt) => (
                      <tr key={appt._id}>
                        <td className="px-6 py-4 whitespace-nowrap">{appt.patientId}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{new Date(appt.startTime).toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{new Date(appt.endTime).toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{appt.status}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{appt.notes}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {appt.status === 'pending' && (
                            <Button onClick={() => updateAppointmentStatus(appt._id, 'confirm')} variant="contained" color="primary" size="small" sx={{ mr: 1 }}>
                              Confirm
                            </Button>
                          )}
                          {appt.status === 'confirmed' && (
                            <>
                              <Button onClick={() => updateAppointmentStatus(appt._id, 'start')} variant="contained" color="secondary" size="small" sx={{ mr: 1 }}>
                                Start
                              </Button>
                              <Button onClick={() => updateAppointmentStatus(appt._id, 'cancel', { reason: 'Cancelled by doctor' })} variant="outlined" color="error" size="small" sx={{ mr: 1 }}>
                                Cancel
                              </Button>
                              <Button onClick={() => updateAppointmentStatus(appt._id, 'complete', { notes: 'Completed successfully' })} variant="contained" color="success" size="small">
                                Complete
                              </Button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Paper>
            )}
          </Box>
        );
      case 'profile':
        return profileLoading ? (
          <CircularProgress />
        ) : profileError ? (
          <Alert severity="error">{profileError}</Alert>
        ) : (
          <Box>
            <Typography variant="h5" fontWeight={700} mb={2} className="text-blue-700">Profile</Typography>
            {renderProfileFields()}
            {editMode ? (
              <Stack direction="row" spacing={2} mt={2}>
                <Button onClick={updateDoctorProfile} variant="contained" color="primary">
                  Save
                </Button>
                <Button onClick={() => setEditMode(false)} variant="outlined" color="secondary">
                  Cancel
                </Button>
              </Stack>
            ) : (
              <Button onClick={() => setEditMode(true)} variant="contained" color="primary" sx={{ mt: 2 }}>
                Edit
              </Button>
            )}
          </Box>
        );
      case 'schedule':
        return <DoctorScheduleManagement />;
      case 'prescriptions':
        return <PrescriptionManagement />;
      case 'transactions':
        return <DoctorTransactions doctorId={doctorId} />;
      default:
        return <Typography variant="h6">Welcome to the Doctor Dashboard</Typography>;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(120deg, #f4f7fa 0%, #e9eafc 100%)' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 260,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 260,
            boxSizing: 'border-box',
            background: '#fff',
            borderRight: '1px solid #e0e0e0',
            p: 0,
          },
        }}
      >
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 64, height: 64, mb: 1, bgcolor: 'primary.main' }}>{doctorUser.name[0]}</Avatar>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>Doctor Dashboard</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{doctorUser.email}</Typography>
        </Box>
        <Divider />
        <List sx={{ mt: 1 }}>
          {sidebarItems.map((item) => (
            <ListItem
              button
              key={item.key}
              selected={activeSection === item.key}
              onClick={() => handleSidebarClick(item.key)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                mx: 1,
                color: activeSection === item.key ? 'primary.main' : 'text.primary',
                backgroundColor: activeSection === item.key ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.12)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="contained"
            color="error"
            startIcon={<Logout />}
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
            sx={{ borderRadius: 2, fontWeight: 600 }}
          >
            Sign Out
          </Button>
        </Box>
      </Drawer>
      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <AppBar position="static" elevation={0} sx={{ background: 'transparent', boxShadow: 'none', p: 0 }}>
          <Toolbar sx={{ justifyContent: 'flex-end', minHeight: 64 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body1" color="text.primary">
                {doctorUser.name}
              </Typography>
              <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>{doctorUser.name[0]}</Avatar>
            </Stack>
          </Toolbar>
        </AppBar>
        {/* Content Area */}
        <Box sx={{ flex: 1, p: { xs: 2, md: 4 }, background: 'none' }}>
          <Paper elevation={2} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, minHeight: 400, boxShadow: '0 4px 24px rgba(25, 118, 210, 0.06)' }}>
            {renderContent()}
          </Paper>
        </Box>
      </Box>
      {/* Snackbar for feedback */}
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
