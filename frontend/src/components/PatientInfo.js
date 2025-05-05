import React from 'react';
import { Typography } from '@mui/material';

function PatientInfo({ patient }) {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        {patient.Name || patient.name}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Email: {patient.Email || patient.email}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Phone: {patient.Phone || patient.phone || 'N/A'}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Address: {patient.Address || patient.address || 'N/A'}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Date of Birth: {patient.DateOfBirth || patient.dateOfBirth || 'N/A'}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Gender: {patient.Gender || patient.gender || 'N/A'}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Insurance Provider: {patient.InsuranceProvider || patient.insuranceProvider || 'N/A'}
      </Typography>
    </>
  );
}

export default PatientInfo;
