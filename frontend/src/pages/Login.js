import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Alert,
  Stack,
  Paper,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Divider,
  Link,
} from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined } from '@mui/icons-material';
import { login, loginWithGoogle } from '../api/auth';
import GoogleLoginButton from '../components/GoogleLoginButton';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      localStorage.setItem('patientId', data.user.patientId); // Store patientId in localStorage
      navigate('/dashboard');
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
      localStorage.setItem('patientId', data.user.patientId); // Store patientId in localStorage
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(120deg, #e3f0ff 0%, #f9f9f9 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={6} sx={{ p: 4, borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <LockOutlined color="primary" sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Sign In
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Welcome back! Please enter your details.
            </Typography>
          </Box>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                autoComplete="email"
                variant="outlined"
              />
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                autoComplete="current-password"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword((show) => !show)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Link component={RouterLink} to="#" underline="hover" color="primary" fontSize={14}>
                  Forgot password?
                </Link>
              </Box>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                sx={{ fontWeight: 600, py: 1.5, borderRadius: 2, boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)' }}
              >
                Sign In
              </Button>
              <Divider sx={{ my: 1 }}>or</Divider>
              <GoogleLoginButton onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
            </Stack>
          </form>
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don&apos;t have an account?{' '}
              <Link component={RouterLink} to="/signup" underline="hover" color="primary" fontWeight={600}>
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;
