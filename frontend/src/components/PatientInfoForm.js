import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

function PatientInfoForm({ patient, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    Name: patient.Name || patient.name || '',
    Email: patient.Email || patient.email || '',
    Phone: patient.Phone || patient.phone || '',
    Address: patient.Address || patient.address || '',
    DateOfBirth: patient.DateOfBirth || patient.dateOfBirth || '',
    Gender: patient.Gender || patient.gender || '',
    InsuranceProvider: patient.InsuranceProvider || patient.insuranceProvider || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        fullWidth
        margin="normal"
        label="Name"
        name="Name"
        value={formData.Name}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Email"
        name="Email"
        type="email"
        value={formData.Email}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Phone"
        name="Phone"
        value={formData.Phone}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Address"
        name="Address"
        value={formData.Address}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Date of Birth"
        name="DateOfBirth"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={formData.DateOfBirth}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Gender"
        name="Gender"
        value={formData.Gender}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Insurance Provider"
        name="InsuranceProvider"
        value={formData.InsuranceProvider}
        onChange={handleChange}
      />
      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Button variant="contained" type="submit">Save</Button>
        <Button variant="outlined" onClick={onCancel}>Cancel</Button>
      </Box>
    </Box>
  );
}

export default PatientInfoForm;
