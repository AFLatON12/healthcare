import React, { useState } from 'react';
import { Typography, Container, Box, CircularProgress, Alert, Button } from '@mui/material';
import NavigationBar from '../components/NavigationBar';
import PatientInfo from '../components/PatientInfo';
import MedicalHistoryList from '../components/MedicalHistoryList';
import PatientInfoForm from '../components/PatientInfoForm';
import MedicalHistoryForm from '../components/MedicalHistoryForm';
import usePatientData from '../hooks/usePatientData';

function PatientDashboard({ patientId }) {
  const { patient, loading, error, updatePatient } = usePatientData(patientId);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  const handleProfile = () => {
    window.location.href = `/patients/${patientId}/profile`;
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleSavePatientInfo = (updatedInfo) => {
    // TODO: Call API to update patient info
    updatePatient(updatedInfo);
    setEditMode(false);
  };

  const handleSaveMedicalHistory = (updatedHistory) => {
    // TODO: Call API to update medical history
    updatePatient({ MedicalHistory: updatedHistory });
    setEditMode(false);
  };

  if (loading) {
    return (
      <>
        <NavigationBar isLoggedIn={isLoggedIn} onLogout={handleLogout} onProfile={handleProfile} />
        <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
          <CircularProgress />
          <Typography>Loading patient data...</Typography>
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavigationBar isLoggedIn={isLoggedIn} onLogout={handleLogout} onProfile={handleProfile} />
        <Container maxWidth="md" sx={{ mt: 8 }}>
          <Alert severity="error">{error}</Alert>
        </Container>
      </>
    );
  }

  if (!patient) {
    return (
      <>
        <NavigationBar isLoggedIn={isLoggedIn} onLogout={handleLogout} onProfile={handleProfile} />
        <Container maxWidth="md" sx={{ mt: 8 }}>
          <Typography>No patient data available.</Typography>
        </Container>
      </>
    );
  }

  return (
    <>
      <NavigationBar isLoggedIn={isLoggedIn} onLogout={handleLogout} onProfile={handleProfile} />
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Welcome, {patient.Name || patient.name}
          </Typography>
          <Button variant="contained" onClick={handleEditToggle}>
            {editMode ? 'Cancel' : 'Edit'}
          </Button>
        </Box>
        {editMode ? (
          <>
            <PatientInfoForm patient={patient} onSave={handleSavePatientInfo} onCancel={handleEditToggle} />
            <Box mt={4}>
              <MedicalHistoryForm medicalHistory={patient.MedicalHistory} onSave={handleSaveMedicalHistory} onCancel={handleEditToggle} />
            </Box>
          </>
        ) : (
          <>
            <PatientInfo patient={patient} />
            <Box mt={4}>
              <MedicalHistoryList medicalHistory={patient.MedicalHistory} />
            </Box>
          </>
        )}
      </Container>
    </>
  );
}

export default PatientDashboard;
