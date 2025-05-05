import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Container, AppBar, Toolbar, Button, Typography, Snackbar, Alert, Stack, Paper, Box } from '@mui/material';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import DoctorSignUp from './pages/DoctorSignUp';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';

import GoogleLoginButton from './components/GoogleLoginButton';
import { loginWithGoogle } from './api/auth';

import RoleBasedRoute from './routes/RoleBasedRoute';
import DashboardRedirect from './routes/DashboardRedirect';
import PatientDashboardWrapper from './routes/PatientDashboardWrapper';

function Home() {
  const navigate = useNavigate();
  const [error, setError] = React.useState('');

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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url(/national-cancer-institute-701-FJcjLAQ-unsplash.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
        <Paper elevation={6} sx={{ p: 4, borderRadius: 3, textAlign: 'center', position: 'relative', overflow: 'hidden', backgroundColor: 'rgba(255, 255, 255, 0.85)' }}>
          <Typography variant="h3" gutterBottom>Welcome to Healthcare</Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            Your health, our priority. Please choose an option to continue.
          </Typography>
          <Stack spacing={2} direction="column" alignItems="center">
            <Button variant="contained" color="primary" onClick={() => navigate('/login')} fullWidth>
              Sign In
            </Button>
            <Button variant="outlined" color="primary" onClick={() => navigate('/signup')} fullWidth>
              Sign Up
            </Button>
            <Button variant="contained" color="secondary" onClick={() => navigate('/doctor-signup')} fullWidth>
              Join as a Doctor
            </Button>
            <GoogleLoginButton onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
          </Stack>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // If user is signed in and on home page, redirect to dashboard
      if (window.location.pathname === '/') {
        navigate('/dashboard');
      }
    }
    setIsAuthenticated(!!token);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/');
  };

  const handleButtonClick = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleClose = () => {
    setSnackbarOpen(false);
  };

  const location = useLocation();

  // Determine if current route is a dashboard route
  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  return (
    <>
      {!isDashboardRoute && (
        <AppBar position="static">
          <Toolbar>
            <Button color="inherit" component={Link} to="/">Home</Button>
            {isAuthenticated ? (
              <>
                <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
                <Button color="inherit" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">Sign In</Button>
                <Button color="inherit" component={Link} to="/signup">Sign Up</Button>
                <Button color="inherit" component={Link} to="/doctor-signup">Join as a Doctor</Button>
              </>
            )}
          </Toolbar>
        </AppBar>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/doctor-signup" element={<DoctorSignUp />} />
        {/* Add routes for dashboard as needed */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <DashboardRedirect />
          </PrivateRoute>
        } />
        <Route path="/dashboard/patient/:userId" element={
          <RoleBasedRoute allowedRoles={['patient']}>
            <PatientDashboardWrapper />
          </RoleBasedRoute>
        } />
        <Route path="/dashboard/doctor" element={
          <RoleBasedRoute allowedRoles={['doctor']}>
            <DoctorDashboard />
          </RoleBasedRoute>
        } />
        <Route path="/dashboard/admin" element={
          <RoleBasedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </RoleBasedRoute>
        } />
        <Route path="/dashboard/superadmin" element={
          <RoleBasedRoute allowedRoles={['super_admin']}>
            <SuperAdminDashboard />
          </RoleBasedRoute>
        } />
      </Routes>
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
