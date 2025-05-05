import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Stack
} from '@mui/material';
import { registerDoctor } from '../api/auth';

function DoctorSignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialization: '',
    licenseNumber: '',
    qualifications: '',
    experienceYears: '',
    phone: '',
    bio: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const qualificationsArray = formData.qualifications
        .split(/[\n,]+/)
        .map(item => item.trim())
        .filter(item => item.length > 0);

      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        specialization: formData.specialization,
        licenseNumber: formData.licenseNumber,
        qualifications: qualificationsArray,
        experienceYears: parseInt(formData.experienceYears, 10) || 0,
        phone: formData.phone,
        bio: formData.bio
      };

      await registerDoctor(payload);
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8} p={4} boxShadow={3} borderRadius={2}>
        <Typography variant="h4" gutterBottom>Doctor Sign Up</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField label="Name" name="name" value={formData.name} onChange={handleChange} required fullWidth />
            <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required fullWidth />
            <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required fullWidth />
            <TextField label="Specialization" name="specialization" value={formData.specialization} onChange={handleChange} required fullWidth />
            <TextField label="License Number" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} required fullWidth />
            <TextField
              label="Qualifications"
              name="qualifications"
              value={formData.qualifications}
              onChange={handleChange}
              multiline
              rows={3}
              placeholder="Enter qualifications separated by commas or new lines"
              fullWidth
              required
            />
            <TextField
              label="Years of Experience"
              name="experienceYears"
              type="number"
              value={formData.experienceYears}
              onChange={handleChange}
              inputProps={{ min: 0 }}
              fullWidth
              required
            />
            <TextField label="Phone" name="phone" value={formData.phone} onChange={handleChange} fullWidth />
            <TextField
              label="Bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Register
            </Button>
          </Stack>
        </form>
      </Box>
    </Container>
  );
}

export default DoctorSignUp;
