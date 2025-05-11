import React, { useState } from 'react';
import {
  Button, Typography, Box, Paper, AppBar, Toolbar, Avatar, Stack, Divider, List, ListItem, ListItemIcon, ListItemText, Drawer, Snackbar, Alert, Chip
} from '@mui/material';
import {
  People, LocalHospital, Person, Settings, HealthAndSafety, Logout, Star
} from '@mui/icons-material';
import AdminManagement from '../components/AdminManagement';
import DoctorManagement from '../components/DoctorManagement';
import PatientManagement from '../components/PatientManagement';
import SystemManagement from '../components/SystemManagement';
import HealthCheck from '../components/HealthCheck';

const sidebarItems = [
  { key: 'adminManagement', label: 'Admin Management', icon: <People /> },
  { key: 'doctorManagement', label: 'Doctor Management', icon: <LocalHospital /> },
  { key: 'patientManagement', label: 'Patient Management', icon: <Person /> },
  { key: 'systemManagement', label: 'System Management', icon: <Settings /> },
  { key: 'healthCheck', label: 'Health Check', icon: <HealthAndSafety /> },
];

const SuperAdminDashboard = ({ userPermissions = ['all_permissions'] }) => {
  const [activeSection, setActiveSection] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const permissions = userPermissions || [];
  const expandedPermissions = permissions.includes('all_permissions')
    ? [
      'admin:create', 'admin:list', 'admin:view', 'admin:update', 'admin:delete',
      'doctor:list', 'doctor:view', 'doctor:approve', 'doctor:reject', 'doctor:delete',
      'patient:create', 'patient:delete', 'patient:list', 'patient:view',
      'system:config', 'system:metrics', 'system:logs',
    ]
    : permissions;

  const superAdminUser = {
    name: 'Super Admin',
    email: 'superadmin@healthcare.com',
    avatar: '',
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'adminManagement':
        return <AdminManagement userPermissions={expandedPermissions} isSuperAdmin={true} />;
      case 'doctorManagement':
        return <DoctorManagement userPermissions={expandedPermissions} />;
      case 'patientManagement':
        return <PatientManagement userPermissions={expandedPermissions} />;
      case 'systemManagement':
        return <SystemManagement userPermissions={expandedPermissions} />;
      case 'healthCheck':
        return <HealthCheck />;
      default:
        return <Typography variant="h6">Welcome to the <b>Super Admin</b> Dashboard</Typography>;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(120deg, #f7fafc 0%, #e3eafc 100%)' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 260,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 260,
            boxSizing: 'border-box',
            background: 'linear-gradient(135deg, #fff 60%, #e3eafc 100%)',
            borderRight: '1px solid #e0e0e0',
            p: 0,
          },
        }}
      >
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 64, height: 64, mb: 1, bgcolor: 'secondary.main' }}>{superAdminUser.name[0]}</Avatar>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>Super Admin</Typography>
          <Chip icon={<Star />} label="Super Admin" color="secondary" size="small" sx={{ mb: 1 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{superAdminUser.email}</Typography>
        </Box>
        <Divider />
        <List sx={{ mt: 1 }}>
          {sidebarItems.map((item) => (
            <ListItem
              button
              key={item.key}
              selected={activeSection === item.key}
              onClick={() => setActiveSection(item.key)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                mx: 1,
                color: activeSection === item.key ? 'secondary.main' : 'text.primary',
                backgroundColor: activeSection === item.key ? 'rgba(220, 0, 78, 0.08)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(220, 0, 78, 0.12)',
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
              <Chip icon={<Star />} label="Super Admin" color="secondary" size="small" />
              <Typography variant="body1" color="text.primary">
                {superAdminUser.name}
              </Typography>
              <Avatar sx={{ width: 36, height: 36, bgcolor: 'secondary.main' }}>{superAdminUser.name[0]}</Avatar>
            </Stack>
          </Toolbar>
        </AppBar>
        {/* Content Area */}
        <Box sx={{ flex: 1, p: { xs: 2, md: 4 }, background: 'none' }}>
          <Paper elevation={2} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, minHeight: 400, boxShadow: '0 4px 24px rgba(220, 0, 78, 0.06)' }}>
            {renderContent()}
          </Paper>
        </Box>
      </Box>
      {/* Snackbar for feedback */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SuperAdminDashboard;
