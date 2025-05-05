import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Alert, Stack } from '@mui/material';
import { login, loginWithGoogle } from '../api/auth';
import GoogleLoginButton from '../components/GoogleLoginButton';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');  // Changed from '/' to '/dashboard' for role-based redirect
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSuccess = async (tokenResponse) => {
    setError('');
    try {
      const data = await loginWithGoogle(tokenResponse.access_token);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');  // Changed from '/' to '/dashboard' for role-based redirect
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleError = (error) => {
    setError('Google login failed');
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8} p={4} boxShadow={3} borderRadius={2}>
        <Typography variant="h4" gutterBottom>Login</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Sign In
            </Button>
            <GoogleLoginButton onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
          </Stack>
        </form>
      </Box>
    </Container>
  );
}

export default Login;
