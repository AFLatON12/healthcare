import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Stack,
  MenuItem,
  Snackbar
} from '@mui/material';
import { registerPatient, loginWithGoogle } from '../api/auth';
import GoogleLoginButton from '../components/GoogleLoginButton';

const genders = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' }
];

function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    insuranceProvider: '',
    medicalHistory: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9+\-\s()]*$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return passwordRegex.test(password);
  };

  const validateDate = (date) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) return false;
    const d = new Date(date);
    return d instanceof Date && !isNaN(d);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.phone && !validatePhone(formData.phone)) {
      setError('Invalid phone number format');
      return;
    }
    if (!validatePassword(formData.password)) {
      setError('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.');
      return;
    }
    if (!validateDate(formData.dateOfBirth)) {
      setError('Invalid or missing date of birth. Please use the format YYYY-MM-DD.');
      return;
    }
    setSubmitting(true);
    try {
      const medicalHistoryArray = formData.medicalHistory
        .split(/[\n,]+/)
        .map(item => item.trim())
        .filter(item => item.length > 0);

      // Send date_of_birth in snake_case as expected by backend
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        date_of_birth: formData.dateOfBirth,
        gender: formData.gender,
        insurance_provider: formData.insuranceProvider || null,
        medical_history: medicalHistoryArray,
        social_id: null,
        social_provider: null
      };

      const data = await registerPatient(payload);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (tokenResponse) => {
    setError('');
    try {
      const data = await loginWithGoogle(tokenResponse.access_token);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleError = (error) => {
    setError('Google login failed');
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8} p={4} boxShadow={3} borderRadius={2}>
        <Typography variant="h4" gutterBottom>Sign Up</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Password must be at least 8 characters and include uppercase, lowercase, number, and special character.
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField label="Name" name="name" value={formData.name} onChange={handleChange} required fullWidth />
            <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required fullWidth />
            <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required fullWidth />
            <TextField label="Phone" name="phone" value={formData.phone} onChange={handleChange} fullWidth />
            <TextField label="Address" name="address" value={formData.address} onChange={handleChange} fullWidth />
            <TextField
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
            <TextField
              select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              fullWidth
              required
            >
              {genders.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField label="Insurance Provider (optional)" name="insuranceProvider" value={formData.insuranceProvider} onChange={handleChange} fullWidth />
            <TextField
              label="Medical History"
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              multiline
              rows={3}
              placeholder="Enter medical history separated by commas or new lines"
              fullWidth
            />
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={submitting}>
              {submitting ? 'Registering...' : 'Register'}
            </Button>
            <GoogleLoginButton onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
          </Stack>
        </form>
      </Box>
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message="Registration successful! Redirecting to login..."
      />
    </Container>
  );
}

export default SignUp;
