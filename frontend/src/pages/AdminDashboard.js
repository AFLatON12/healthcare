import React, { useState } from 'react';
import {
  Button,
  Typography,
  Box,
  Paper,
  Snackbar,
  Alert,
  Divider,
  Avatar,
  Stack,
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
} from '@mui/material';
import {
  People,
  LocalHospital,
  Person,
  Settings,
  HealthAndSafety,
  ReceiptLong,
  Logout,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import AdminManagement from '../components/AdminManagement';
import DoctorManagement from '../components/DoctorManagement';
import PatientManagement from '../components/PatientManagement';
import SystemManagement from '../components/SystemManagement';
import HealthCheck from '../components/HealthCheck';
import Transactions from './Transactions';

const sidebarItems = [
  {
    key: 'adminManagement',
    label: 'Admin Management',
    icon: <People />,
    permissions: ['admin:create', 'admin:list', 'admin:view', 'admin:update', 'admin:delete'],
  },
  {
    key: 'doctorManagement',
    label: 'Doctor Management',
    icon: <LocalHospital />,
    permissions: ['doctor:list'],
  },
  {
    key: 'patientManagement',
    label: 'Patient Management',
    icon: <Person />,
    permissions: ['patient:list'],
  },
  {
    key: 'systemManagement',
    label: 'System Management',
    icon: <Settings />,
    permissions: ['system:config'],
  },
  {
    key: 'healthCheck',
    label: 'Health Check',
    icon: <HealthAndSafety />,
    permissions: [],
  },
  {
    key: 'transactions',
    label: 'Transactions',
    icon: <ReceiptLong />,
    permissions: [],
  },
];

const AdminDashboard = ({ userPermissions = [] }) => {
  const [activeSection, setActiveSection] = useState('adminManagement');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const hasAnyPermission = (permissions) => permissions.some((perm) => userPermissions.includes(perm));

  const handleSidebarClick = (item) => {
    if (hasAnyPermission(item.permissions) || item.permissions.length === 0) {
      setActiveSection(item.key);
    } else {
      setSnackbarMessage('You do not have permission to access this section.');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'adminManagement':
        return hasAnyPermission(['admin:create', 'admin:list', 'admin:view', 'admin:update', 'admin:delete']) ? (
          <AdminManagement userPermissions={userPermissions} />
        ) : (
          <Typography variant="h6" color="error">You do not have permission to view this section.</Typography>
        );
      case 'doctorManagement':
        return hasAnyPermission(['doctor:list']) ? (
          <DoctorManagement userPermissions={userPermissions} />
        ) : (
          <Typography variant="h6" color="error">You do not have permission to view this section.</Typography>
        );
      case 'patientManagement':
        return hasAnyPermission(['patient:list']) ? (
          <PatientManagement userPermissions={userPermissions} />
        ) : (
          <Typography variant="h6" color="error">You do not have permission to view this section.</Typography>
        );
      case 'systemManagement':
        return hasAnyPermission(['system:config']) ? (
          <SystemManagement userPermissions={userPermissions} />
        ) : (
          <Typography variant="h6" color="error">You do not have permission to view this section.</Typography>
        );
      case 'healthCheck':
        return <HealthCheck />;
      case 'transactions':
        return <Transactions />;
      default:
        return <Typography variant="h6">Welcome to the Admin Dashboard</Typography>;
    }
  };

  // Simulate admin user info
  const adminUser = {
    name: 'Admin User',
    email: 'admin@healthcare.com',
    avatar: '',
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(120deg, #f4f7fa 0%, #e9eafc 100%)' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 260,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 260,
            boxSizing: 'border-box',
            background: '#fff',
            borderRight: '1px solid #e0e0e0',
            p: 0,
          },
        }}
      >
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 64, height: 64, mb: 1, bgcolor: 'primary.main' }}>{adminUser.name[0]}</Avatar>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>Admin Dashboard</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{adminUser.email}</Typography>
        </Box>
        <Divider />
        <List sx={{ mt: 1 }}>
          {sidebarItems.map((item) => (
            <ListItem
              button
              key={item.key}
              selected={activeSection === item.key}
              onClick={() => handleSidebarClick(item)}
              disabled={item.permissions.length > 0 && !hasAnyPermission(item.permissions)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                mx: 1,
                color: activeSection === item.key ? 'primary.main' : 'text.primary',
                backgroundColor: activeSection === item.key ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.12)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="contained"
            color="error"
            startIcon={<Logout />}
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
            sx={{ borderRadius: 2, fontWeight: 600 }}
          >
            Sign Out
          </Button>
        </Box>
      </Drawer>
      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <AppBar position="static" elevation={0} sx={{ background: 'transparent', boxShadow: 'none', p: 0 }}>
          <Toolbar sx={{ justifyContent: 'flex-end', minHeight: 64 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body1" color="text.primary">
                {adminUser.name}
              </Typography>
              <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>{adminUser.name[0]}</Avatar>
            </Stack>
          </Toolbar>
        </AppBar>
        {/* Content Area */}
        <Box sx={{ flex: 1, p: { xs: 2, md: 4 }, background: 'none' }}>
          <Paper elevation={2} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, minHeight: 400, boxShadow: '0 4px 24px rgba(25, 118, 210, 0.06)' }}>
            {renderContent()}
          </Paper>
        </Box>
      </Box>
      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminDashboard;
