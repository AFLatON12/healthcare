import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import './PatientDashboard.css';
import { fetchDoctors } from '../api/doctorApi';
import { fetchAppointmentsByPatient, createAppointment, updateAppointmentStatus, deleteAppointment } from '../api/appointmentApiNew';

const PatientDashboard = () => {
  const [activeSection, setActiveSection] = useState('appointments');
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [newAppointment, setNewAppointment] = useState({ doctorId: '', date: '', time: '' });
  const [patientId, setPatientId] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

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
  }, []);

  const fetchDoctorsList = async () => {
    try {
      const doctorsData = await fetchDoctors();
      setDoctors(doctorsData);
    } catch (error) {
      console.error('Error fetching doctors:', error);
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
      const appointmentData = {
        patientId,
        doctorId: newAppointment.doctorId,
        date: newAppointment.date,
        time: newAppointment.time,
        status: 'scheduled',
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
    try {
      await updateAppointmentStatus(appointmentId, 'confirm');
      fetchAppointments(patientId);
    } catch (error) {
      console.error('Error confirming appointment:', error);
    }
  };

  const handleSpecialtyChange = (event) => {
    setSelectedSpecialty(event.target.value);
  };

  const renderAppointmentsSection = () => (
    <Box>
      <Typography variant="h6">Your Appointments</Typography>
      {appointments.length === 0 ? (
        <Typography>No appointments found.</Typography>
      ) : (
        appointments.map(app => (
          <Paper key={app._id} className="appointment-card" elevation={2} sx={{ p: 2, mb: 2 }}>
            <Typography>Doctor: {app.doctorId?.name || app.doctorId}</Typography>
            <Typography>Date: {app.date}</Typography>
            <Typography>Time: {app.time}</Typography>
            <Typography>Status: {app.status}</Typography>
            {app.status === 'scheduled' && (
              <>
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
    <Typography>Profile Section</Typography>
  );

  const renderPrescriptionsSection = () => (
    <Typography>Prescriptions Section</Typography>
  );

  const renderDoctorsSection = () => (
    <Box>
      <Typography variant="h6">All Doctors</Typography>
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
              <Typography>Specialty: {doctor.specialty}</Typography>
              <Typography>Experience: {doctor.experience} years</Typography>
              <Typography>Contact: {doctor.contact}</Typography>
              <Button
                variant="contained"
                onClick={() => setNewAppointment(prev => ({ ...prev, doctorId: doctor._id }))}
              >
                Select Doctor
              </Button>
            </Paper>
          ))
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
