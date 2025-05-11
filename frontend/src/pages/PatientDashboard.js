import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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
  Snackbar,
  Alert,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Skeleton,
} from '@mui/material';
import {
  CalendarToday,
  Person,
  Assignment,
  LocalHospital,
  MonetizationOn,
  Logout,
  Delete,
  CheckCircle,
  HourglassEmpty,
} from '@mui/icons-material';
import './PatientDashboard.css';
import { fetchDoctors } from '../api/doctorApi';
import { fetchAppointmentsByPatient, createAppointment, updateAppointmentStatus, deleteAppointment } from '../api/appointmentApiNew';
import { fetchPatientProfile, updatePatientProfile } from '../api/patientApi';
import { fetchPrescriptionsByPatient } from '../api/prescriptionApi';
import PatientTransactions from '../components/PatientTransactions';
import PaymobPayment from '../components/PaymobPayment';

const sidebarItems = [
  { key: 'appointments', label: 'Appointments', icon: <CalendarToday /> },
  { key: 'profile', label: 'Profile', icon: <Person /> },
  { key: 'prescriptions', label: 'Prescriptions', icon: <Assignment /> },
  { key: 'doctors', label: 'Doctors', icon: <LocalHospital /> },
  { key: 'transactions', label: 'Transactions', icon: <MonetizationOn /> },
];

const PatientDashboard = () => {
  const [activeSection, setActiveSection] = useState('appointments');
  const [doctors, setDoctors] = useState([]);
  const [doctorFetchError, setDoctorFetchError] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [payments, setPayments] = useState({}); // key: appointmentId, value: payment info
  const [newAppointment, setNewAppointment] = useState({ doctorId: '', date: '', time: '' });
  const [patientId, setPatientId] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', address: '' });
  const [paymentToken, setPaymentToken] = useState(null);
  const [paymentInProgress, setPaymentInProgress] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPrescriptions, setLoadingPrescriptions] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, appointmentId: null });

  useEffect(() => {
    const storedPatientId = localStorage.getItem('patientId');
    if (!storedPatientId) {
      alert('Patient ID not found. Please log in again.');
      window.location.href = '/login';
      return;
    }
    setPatientId(storedPatientId);

    fetchAppointments(storedPatientId);
    fetchDoctorsList();
    fetchPatientProfile(storedPatientId)
      .then(profile => setProfile(profile))
      .catch(err => console.error('Failed to fetch patient profile:', err));
  }, []);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const data = await fetchPrescriptionsByPatient(patientId);
        setPrescriptions(data);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
      }
    };

    if (patientId) {
      fetchPrescriptions();
    }
  }, [patientId]);

  const fetchDoctorsList = async () => {
    try {
      const doctorsData = await fetchDoctors();
      setDoctors(doctorsData);
      setDoctorFetchError(null);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setDoctorFetchError('Failed to fetch doctors. Please try again later.');
    }
  };

  const fetchAppointments = async (patientId) => {
    try {
      setLoadingAppointments(true);
      const appointmentsData = await fetchAppointmentsByPatient(patientId);
      setAppointments(appointmentsData);

      // Fetch payment info for each appointment
      const paymentsData = {};
      await Promise.all(
        appointmentsData.map(async (appointment) => {
          try {
            const response = await fetch(`/api/appointments/${appointment._id}/payment`);
            if (response.ok) {
              const payment = await response.json();
              paymentsData[appointment._id] = payment;
            }
          } catch (error) {
            console.error(`Failed to fetch payment for appointment ${appointment._id}:`, error);
          }
        })
      );
      setPayments(paymentsData);
      setSnackbar({ open: true, message: 'Appointments fetched successfully', severity: 'success' });
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setSnackbar({ open: true, message: 'Error fetching appointments', severity: 'error' });
    } finally {
      setLoadingAppointments(false);
    }
  };

  const handleNewAppointmentChange = (field, value) => {
    setNewAppointment(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateAppointment = async () => {
    if (!newAppointment.doctorId || !newAppointment.date || !newAppointment.time) {
      setSnackbar({ open: true, message: 'Please fill all appointment details', severity: 'warning' });
      return;
    }
    try {
      // Construct startTime and endTime as ISO strings
      const startDateTime = new Date(`${newAppointment.date}T${newAppointment.time}`);
      const endDateTime = new Date(startDateTime.getTime() + 30 * 60000); // 30 minutes duration

      const appointmentData = {
        patientId,
        doctorId: newAppointment.doctorId,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        status: 'pending',
      };
      const created = await createAppointment(appointmentData);
      setAppointments(prev => [...prev, created]);
      setNewAppointment({ doctorId: '', date: '', time: '' });
      setSnackbar({ open: true, message: 'Appointment created successfully', severity: 'success' });
    } catch (error) {
      console.error('Error creating appointment:', error);
      setSnackbar({ open: true, message: 'Failed to create appointment', severity: 'error' });
    }
  };

  const handleConfirmAppointment = async (appointmentId) => {
    const price = priceInput[appointmentId];
    if (!price || isNaN(price) || price <= 0) {
      setSnackbar({ open: true, message: 'Please enter a valid price before confirming.', severity: 'warning' });
      return;
    }
    try {
      await updateAppointmentStatus(appointmentId, 'confirm', { price });
      fetchAppointments(patientId);
      setSnackbar({ open: true, message: 'Appointment confirmed', severity: 'success' });
    } catch (error) {
      console.error('Error confirming appointment:', error);
      setSnackbar({ open: true, message: 'Failed to confirm appointment', severity: 'error' });
    }
  };

  const handleSpecialtyChange = (event) => {
    setSelectedSpecialty(event.target.value);
  };

  const [priceInput, setPriceInput] = React.useState({});

  const handlePriceChange = (appointmentId, value) => {
    setPriceInput(prev => ({ ...prev, [appointmentId]: value }));
  };

  const handleDeleteAppointment = useCallback((appointmentId) => {
    setConfirmDialog({ open: true, appointmentId });
  }, []);

  const confirmDeleteAppointment = async () => {
    try {
      await deleteAppointment(confirmDialog.appointmentId);
      setAppointments(prev => prev.filter(app => app._id !== confirmDialog.appointmentId));
      setSnackbar({ open: true, message: 'Appointment deleted successfully', severity: 'success' });
    } catch (error) {
      console.error('Error deleting appointment:', error);
      setSnackbar({ open: true, message: 'Failed to delete appointment', severity: 'error' });
    } finally {
      setConfirmDialog({ open: false, appointmentId: null });
    }
  };

  const renderAppointmentsSection = () => (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <CalendarToday color="primary" />
        <Typography variant="h6">Your Appointments</Typography>
      </Stack>
      {loadingAppointments ? (
        <Stack spacing={2}>
          <Skeleton variant="rectangular" height={60} />
          <Skeleton variant="rectangular" height={60} />
        </Stack>
      ) : appointments.length === 0 ? (
        <Typography>No appointments found.</Typography>
      ) : (
        appointments.map(app => (
          <Paper key={app._id} elevation={2} sx={{ p: 2, mb: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography>Doctor: {app.doctorId?.name || 'Unknown Doctor'}</Typography>
                <Typography>Date: {app.startTime ? new Date(app.startTime).toLocaleDateString() : ''}</Typography>
                <Typography>Time: {app.startTime ? new Date(app.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</Typography>
                <Typography>Status: {statusChip(app.status)}</Typography>
              </Box>
              <Stack direction="row" spacing={1}>
                {app.status === 'scheduled' && (
                  <>
                    <TextField
                      label="Set Price"
                      type="number"
                      value={priceInput[app._id] || ''}
                      onChange={(e) => handlePriceChange(app._id, e.target.value)}
                      sx={{ width: 120 }}
                      size="small"
                    />
                    <Button variant="contained" onClick={() => handleConfirmAppointment(app._id)} size="small">Confirm</Button>
                    <Button variant="outlined" color="error" startIcon={<Delete />} onClick={() => handleDeleteAppointment(app._id)} size="small">Delete</Button>
                  </>
                )}
                {app.status !== 'scheduled' && (
                  <Button variant="outlined" color="error" startIcon={<Delete />} onClick={() => handleDeleteAppointment(app._id)} size="small">Delete</Button>
                )}
              </Stack>
            </Stack>
            {app.status !== 'scheduled' && (
              <>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Payment Receipt:
                </Typography>
                {payments[app._id] ? (
                  <Paper variant="outlined" sx={{ p: 1, mt: 1 }}>
                    <Typography>Amount: ${payments[app._id].amount}</Typography>
                    <Typography>Status: {payments[app._id].status}</Typography>
                    <Typography>Method: {payments[app._id].method || 'N/A'}</Typography>
                    {payments[app._id].paymentDate && (
                      <Typography>
                        Paid on: {new Date(payments[app._id].paymentDate).toLocaleString()}
                      </Typography>
                    )}
                  </Paper>
                ) : (
                  <Typography>No payment information available.</Typography>
                )}
              </>
            )}
          </Paper>
        ))
      )}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Make a New Appointment</Typography>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Selected Doctor: {doctors.find(doc => doc._id === newAppointment.doctorId)?.name || 'None'}
        </Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="doctor-select-label">Doctor</InputLabel>
          <Select
            labelId="doctor-select-label"
            value={newAppointment.doctorId}
            label="Doctor"
            onChange={(e) => handleNewAppointmentChange('doctorId', e.target.value)}
          >
            {doctors.map(doc => (
              <MenuItem key={doc._id} value={doc._id}>{doc.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Date"
          type="date"
          fullWidth
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
          value={newAppointment.date}
          onChange={(e) => handleNewAppointmentChange('date', e.target.value)}
        />
        <TextField
          label="Time"
          type="time"
          fullWidth
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
          value={newAppointment.time}
          onChange={(e) => handleNewAppointmentChange('time', e.target.value)}
        />
        <Button variant="contained" onClick={handleCreateAppointment}>Create Appointment</Button>
      </Box>
    </Box>
  );

  const renderProfileSection = () => (
    <Box>
      <Typography variant="h6">Your Profile</Typography>
      <TextField
        label="Name"
        fullWidth
        sx={{ mb: 2 }}
        value={profile.name}
        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
      />
      <TextField
        label="Email"
        fullWidth
        sx={{ mb: 2 }}
        value={profile.email}
        disabled
      />
      <TextField
        label="Phone"
        fullWidth
        sx={{ mb: 2 }}
        value={profile.phone}
        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
      />
      <TextField
        label="Address"
        fullWidth
        sx={{ mb: 2 }}
        value={profile.address}
        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
      />
      <Button variant="contained" onClick={handleUpdateProfile}>Update Profile</Button>
    </Box>
  );

  const handleUpdateProfile = async () => {
    try {
      await updatePatientProfile(patientId, profile);
      setSnackbar({ open: true, message: 'Profile updated successfully', severity: 'success' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setSnackbar({ open: true, message: 'Failed to update profile', severity: 'error' });
    }
  };

  const renderPrescriptionsSection = () => (
    <Box>
      <Typography variant="h6">Your Prescriptions</Typography>
      {loadingPrescriptions ? (
        <Stack spacing={2}>
          <Skeleton variant="rectangular" height={60} />
          <Skeleton variant="rectangular" height={60} />
        </Stack>
      ) : prescriptions.length === 0 ? (
        <Typography>No prescriptions found.</Typography>
      ) : (
        prescriptions.map(prescription => (
          <Paper key={prescription._id} className="prescription-card" elevation={2} sx={{ p: 2, mb: 2 }}>
            <Typography>Doctor: {prescription.doctorName}</Typography>
            <Typography>Date: {new Date(prescription.date).toLocaleDateString()}</Typography>
            <Typography>Medications:</Typography>
            <ul>
              {prescription.medications.map((med, index) => (
                <li key={index}>{med.name} - {med.dosage}</li>
              ))}
            </ul>
          </Paper>
        ))
      )}
    </Box>
  );

  const renderDoctorsSection = () => (
    <Box>
      <Typography variant="h6">All Doctors</Typography>
      {doctorFetchError ? (
        <Typography color="error">{doctorFetchError}</Typography>
      ) : (
        <>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="specialty-select-label">Filter by Specialty</InputLabel>
            <Select
              labelId="specialty-select-label"
              value={selectedSpecialty}
              label="Filter by Specialty"
              onChange={handleSpecialtyChange}
            >
              <MenuItem value="">All</MenuItem>
              {[...new Set(doctors.map(doc => doc.specialty))].map(specialty => (
                <MenuItem key={specialty} value={specialty}>{specialty}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {doctors.filter(doc => !selectedSpecialty || doc.specialty === selectedSpecialty).length === 0 ? (
            <Typography>No doctors found.</Typography>
          ) : (
            doctors
              .filter(doc => !selectedSpecialty || doc.specialty === selectedSpecialty)
              .map(doctor => (
                <Paper key={doctor._id} className="doctor-card" elevation={2} sx={{ p: 2, mb: 2 }}>
                  <Typography>Name: {doctor.name}</Typography>
                  <Typography>Specialty: {doctor.specialization}</Typography>
                  <Typography>Experience: {doctor.experience} years</Typography>
                  <Typography>Contact: {doctor.contact}</Typography>
                  <Button
                    variant="contained"
                    onClick={() => {
                      console.log('Selected doctorId:', doctor._id);
                      setNewAppointment(prev => ({ ...prev, doctorId: doctor._id }));
                      setActiveSection('appointments');
                    }}
                  >
                    Select Doctor
                  </Button>
                </Paper>
              ))
          )}
        </>
      )}
    </Box>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'appointments':
        return renderAppointmentsSection();
      case 'profile':
        return renderProfileSection();
      case 'prescriptions':
        return renderPrescriptionsSection();
      case 'doctors':
        return renderDoctorsSection();
      case 'transactions':
        if (paymentInProgress && paymentToken) {
          return (
            <PaymobPayment
              paymentToken={paymentToken}
              onPaymentSuccess={(data) => {
                setSnackbar({ open: true, message: 'Payment successful!', severity: 'success' });
                setPaymentInProgress(false);
                setPaymentToken(null);
                setActiveSection('transactions');
              }}
              onPaymentFailure={(data) => {
                setSnackbar({ open: true, message: 'Payment failed or cancelled.', severity: 'error' });
                setPaymentInProgress(false);
                setPaymentToken(null);
              }}
            />
          );
        } else {
          return (
            <>
              <PatientTransactions patientId={patientId} />
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={initiatePaymobPayment}
              >
                Make a Payment
              </Button>
            </>
          );
        }
      default:
        return <Typography>Welcome to the Patient Dashboard</Typography>;
    }
  };

  const initiatePaymobPayment = async () => {
    try {
      // Call backend API to create Paymob payment session and get payment token
      const response = await fetch('/api/payments/paymob-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 100, // example amount, replace with actual
          currency: 'USD',
          firstName: profile.name.split(' ')[0] || 'N/A',
          lastName: profile.name.split(' ')[1] || 'N/A',
          email: profile.email,
          phone: profile.phone,
          // Add other billing info as needed
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment session');
      }

      const data = await response.json();
      setPaymentToken(data.paymentToken);
      setPaymentInProgress(true);
      setActiveSection('transactions');
    } catch (error) {
      console.error('Error initiating Paymob payment:', error);
      setSnackbar({ open: true, message: 'Failed to initiate payment', severity: 'error' });
    }
  };

  // Patient info for top bar
  const patientUser = {
    name: profile?.name || 'Patient',
    email: profile?.email || 'patient@healthcare.com',
    avatar: '',
  };

  // Status chip helper
  const statusChip = (status) => {
    switch (status) {
      case 'pending':
        return <Chip icon={<HourglassEmpty />} label="Pending" color="warning" size="small" />;
      case 'confirmed':
        return <Chip icon={<CheckCircle />} label="Confirmed" color="success" size="small" />;
      case 'scheduled':
        return <Chip icon={<CalendarToday />} label="Scheduled" color="info" size="small" />;
      default:
        return <Chip label={status} size="small" />;
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
          <Avatar sx={{ width: 64, height: 64, mb: 1, bgcolor: 'primary.main' }}>{patientUser.name[0]}</Avatar>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>Patient Dashboard</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{patientUser.email}</Typography>
        </Box>
        <Divider />
        <List sx={{ mt: 1 }}>
          {sidebarItems.map((item) => (
            <ListItem
              button
              key={item.key}
              selected={activeSection === item.key}
              onClick={() => setActiveSection(item.key)}
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
              localStorage.removeItem('patientId');
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
                {patientUser.name}
              </Typography>
              <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>{patientUser.name[0]}</Avatar>
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
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      {/* Confirmation Dialog for delete */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, appointmentId: null })}>
        <DialogTitle>Delete Appointment</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this appointment?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, appointmentId: null })}>Cancel</Button>
          <Button onClick={confirmDeleteAppointment} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientDashboard;
