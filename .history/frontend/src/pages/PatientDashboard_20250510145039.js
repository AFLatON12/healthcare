import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import './PatientDashboard.css';
import { fetchDoctors } from '../api/doctorApi';
import { fetchAppointmentsByPatient, createAppointment, updateAppointmentStatus, deleteAppointment } from '../api/appointmentApiNew';
import { fetchPatientProfile, updatePatientProfile } from '../api/patientApi';
import { fetchPrescriptionsByPatient } from '../api/prescriptionApi';
import PatientTransactions from '../components/PatientTransactions';
import PaymobPayment from '../components/PaymobPayment';

const PatientDashboard = () => {
  const [activeSection, setActiveSection] = useState('appointments');
  const [doctors, setDoctors] = useState([]);
  const [doctorFetchError, setDoctorFetchError] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [newAppointment, setNewAppointment] = useState({ doctorId: '', date: '', time: '' });
  const [patientId, setPatientId] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', address: '' });
  const [paymentToken, setPaymentToken] = useState(null);
  const [paymentInProgress, setPaymentInProgress] = useState(false);

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
      const appointmentsData = await fetchAppointmentsByPatient(patientId);
      setAppointments(appointmentsData);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleNewAppointmentChange = (field, value) => {
    setNewAppointment(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateAppointment = async () => {
    if (!newAppointment.doctorId || !newAppointment.date || !newAppointment.time) {
      alert('Please fill all appointment details');
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
      alert('Appointment created successfully');
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Failed to create appointment');
    }
  };

  const handleConfirmAppointment = async (appointmentId) => {
    const price = priceInput[appointmentId];
    if (!price || isNaN(price) || price <= 0) {
      alert('Please enter a valid price before confirming.');
      return;
    }
    try {
      await updateAppointmentStatus(appointmentId, 'confirm', { price });
      fetchAppointments(patientId);
      alert('Appointment confirmed with price set.');
    } catch (error) {
      console.error('Error confirming appointment:', error);
      alert('Failed to confirm appointment');
    }
  };

  const handleSpecialtyChange = (event) => {
    setSelectedSpecialty(event.target.value);
  };

  const [priceInput, setPriceInput] = React.useState({});

  const handlePriceChange = (appointmentId, value) => {
    setPriceInput(prev => ({ ...prev, [appointmentId]: value }));
  };

  // Remove duplicate declaration of handleConfirmAppointment
  // The original handleConfirmAppointment without price is removed

  const renderAppointmentsSection = () => (
    <Box>
      <Typography variant="h6">Your Appointments</Typography>
      {appointments.length === 0 ? (
        <Typography>No appointments found.</Typography>
      ) : (
        appointments.map(app => (
          <Paper key={app._id} className="appointment-card" elevation={2} sx={{ p: 2, mb: 2 }}>
            <Typography>Doctor: {app.doctorId?.name || 'Unknown Doctor'}</Typography>
            <Typography>Date: {app.startTime ? new Date(app.startTime).toLocaleDateString() : ''}</Typography>
            <Typography>Time: {app.startTime ? new Date(app.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</Typography>
            <Typography>Status: {app.status}</Typography>
            {app.status === 'scheduled' && (
              <>
                <TextField
                  label="Set Price"
                  type="number"
                  value={priceInput[app._id] || ''}
                  onChange={(e) => handlePriceChange(app._id, e.target.value)}
                  sx={{ width: 120, mr: 1 }}
                />
                <Button variant="contained" onClick={() => handleConfirmAppointment(app._id)}>Confirm</Button>
                <Button variant="outlined" color="error" sx={{ ml: 1 }} onClick={() => handleDeleteAppointment(app._id)}>Delete</Button>
              </>
            )}
            {app.status !== 'scheduled' && (
              <Button variant="outlined" color="error" sx={{ ml: 1 }} onClick={() => handleDeleteAppointment(app._id)}>Delete</Button>
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
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const renderPrescriptionsSection = () => (
    <Box>
      <Typography variant="h6">Your Prescriptions</Typography>
      {prescriptions.length === 0 ? (
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
                alert('Payment successful!');
                setPaymentInProgress(false);
                setPaymentToken(null);
                setActiveSection('transactions');
              }}
              onPaymentFailure={(data) => {
                alert('Payment failed or cancelled.');
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

  const handleDeleteAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) {
      return;
    }
    try {
      await deleteAppointment(appointmentId);
      setAppointments(prev => prev.filter(app => app._id !== appointmentId));
      alert('Appointment deleted successfully');
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert('Failed to delete appointment');
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
      alert('Failed to initiate payment');
    }
  };

  return (
    <Box className="dashboard-container">
      <Paper className="sidebar" elevation={3}>
        <Typography variant="h5" className="sidebar-title">Patient Dashboard</Typography>
        <Button fullWidth onClick={() => setActiveSection('appointments')} className="sidebar-button">
          Appointments
        </Button>
        <Button fullWidth onClick={() => setActiveSection('profile')} className="sidebar-button">
          Profile
        </Button>
        <Button fullWidth onClick={() => setActiveSection('prescriptions')} className="sidebar-button">
          Prescriptions
        </Button>
        <Button fullWidth onClick={() => setActiveSection('doctors')} className="sidebar-button">
          Doctors
        </Button>
        <Button fullWidth onClick={() => setActiveSection('transactions')} className="sidebar-button">
          Transactions
        </Button>
        <Button
          fullWidth
          variant="contained"
          color="error"
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('patientId');
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
    </Box>
  );
};

export default PatientDashboard;
