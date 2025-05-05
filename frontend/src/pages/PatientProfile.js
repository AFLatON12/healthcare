import React, { useState } from 'react';
import { Typography, Container, Box, CircularProgress, Alert, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import PatientInfo from '../components/PatientInfo';
import MedicalHistoryList from '../components/MedicalHistoryList';
import PatientInfoForm from '../components/PatientInfoForm';
import MedicalHistoryForm from '../components/MedicalHistoryForm';
import usePatientData from '../hooks/usePatientData';

function PatientProfile() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { patient, loading, error, updatePatient } = usePatientData(patientId);
  const isLoggedIn = !!localStorage.getItem('token');
  const [editMode, setEditMode] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleBack = () => {
    navigate('/patient-dashboard');
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
        <NavigationBar isLoggedIn={isLoggedIn} onLogout={handleLogout} onBack={handleBack} />
        <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
          <CircularProgress />
          <Typography>Loading patient profile...</Typography>
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavigationBar isLoggedIn={isLoggedIn} onLogout={handleLogout} onBack={handleBack} />
        <Container maxWidth="md" sx={{ mt: 8 }}>
          <Alert severity="error">{error}</Alert>
          <Button variant="contained" onClick={handleBack} sx={{ mt: 2 }}>
            Back to Dashboard
          </Button>
        </Container>
      </>
    );
  }

  if (!patient) {
    return (
      <>
        <NavigationBar isLoggedIn={isLoggedIn} onLogout={handleLogout} onBack={handleBack} />
        <Container maxWidth="md" sx={{ mt: 8 }}>
          <Typography>No patient data available.</Typography>
          <Button variant="contained" onClick={handleBack} sx={{ mt: 2 }}>
            Back to Dashboard
          </Button>
        </Container>
      </>
    );
  }

  return (
    <>
      <NavigationBar isLoggedIn={isLoggedIn} onLogout={handleLogout} onBack={handleBack} />
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Patient Profile: {patient.Name || patient.name}
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

export default PatientProfile;
