import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Container, AppBar, Toolbar, Button, Typography, Snackbar, Alert, Stack, Paper, Box, useTheme, useMediaQuery } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import DoctorSignUp from './pages/DoctorSignUp';
import DoctorDashboardNewV2 from './pages/DoctorDashboardNewV2';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import PatientProfile from './pages/PatientProfile';
import Transactions from './pages/Transactions';

import GoogleLoginButton from './components/GoogleLoginButton';
import { loginWithGoogle } from './api/auth';

import RoleBasedRoute from './routes/RoleBasedRoute';
import DashboardRedirect from './routes/DashboardRedirect';
import PatientDashboardWrapper from './routes/PatientDashboardWrapper';

function Home() {
  const navigate = useNavigate();
  const [error, setError] = React.useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/national-cancer-institute-701-FJcjLAQ-unsplash.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: isMobile ? 1 : 2,
      }}
    >
      <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
        <Paper
          elevation={6}
          sx={{
            p: isMobile ? 2 : 4,
            borderRadius: 3,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: theme.palette.primary.main,
              mb: 3,
              fontSize: isMobile ? '2rem' : '2.5rem',
            }}
          >
            Welcome to Healthcare
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 4,
              color: theme.palette.text.secondary,
              fontSize: isMobile ? '1rem' : '1.1rem',
            }}
          >
            Your health, our priority. Please choose an option to continue.
          </Typography>
          <Stack spacing={2} direction="column" alignItems="center">
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/login')}
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1.1rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Sign In
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/signup')}
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1.1rem',
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Sign Up
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate('/doctor-signup')}
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1.1rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Join as a Doctor
            </Button>
            <GoogleLoginButton onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
          </Stack>
          {error && (
            <Typography
              color="error"
              sx={{
                mt: 2,
                p: 1,
                borderRadius: 1,
                backgroundColor: 'rgba(211, 47, 47, 0.1)',
              }}
            >
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
  const [userPermissions, setUserPermissions] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserPermissions(decoded.permissions || []);
      } catch (error) {
        console.error('Failed to decode token:', error);
        setUserPermissions([]);
      }
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
    setUserPermissions([]);
    navigate('/');
  };

  const handleClose = () => {
    setSnackbarOpen(false);
  };

  const location = useLocation();

  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  return (
    <>
      {!isDashboardRoute && (
        <AppBar
          position="static"
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Button
              color="primary"
              component={Link}
              to="/"
              sx={{
                fontWeight: 600,
                fontSize: '1.1rem',
                textTransform: 'none',
              }}
            >
              Healthcare
            </Button>
            <Stack direction="row" spacing={2}>
              {isAuthenticated ? (
                <>
                  <Button
                    color="primary"
                    component={Link}
                    to="/dashboard"
                    sx={{
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                      },
                    }}
                  >
                    Dashboard
                  </Button>
                  <Button
                    color="primary"
                    onClick={handleLogout}
                    sx={{
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                      },
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    color="primary"
                    component={Link}
                    to="/login"
                    sx={{
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                      },
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    color="primary"
                    component={Link}
                    to="/signup"
                    sx={{
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                      },
                    }}
                  >
                    Sign Up
                  </Button>
                  <Button
                    color="primary"
                    component={Link}
                    to="/doctor-signup"
                    sx={{
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                      },
                    }}
                  >
                    Join as a Doctor
                  </Button>
                </>
              )}
            </Stack>
          </Toolbar>
        </AppBar>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/doctor-signup" element={<DoctorSignUp />} />
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
            <DoctorDashboardNewV2 />
          </RoleBasedRoute>
        } />
        <Route path="/dashboard/admin" element={
          <RoleBasedRoute allowedRoles={['admin']}>
            <AdminDashboard userPermissions={userPermissions} />
          </RoleBasedRoute>
        } />
        <Route path="/dashboard/superadmin" element={
          <RoleBasedRoute allowedRoles={['super_admin']}>
            <SuperAdminDashboard userPermissions={userPermissions} isSuperAdmin={true} />
          </RoleBasedRoute>
        } />
        <Route path="/patients/:patientId/profile" element={
          <PrivateRoute>
            <PatientProfile />
          </PrivateRoute>
        } />
        <Route path="/transactions" element={<Transactions />} />
      </Routes>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
          severity="info"
          sx={{
            width: '100%',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            borderRadius: 2,
          }}
        >
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
