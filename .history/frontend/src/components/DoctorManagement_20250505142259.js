import React, { useState, useEffect } from 'react';
import {
  Button,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Tooltip,
} from '@mui/material';

const DoctorManagement = ({ userPermissions = [] }) => {
  const [doctors, setDoctors] = useState([]);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    email: '',
    specialization: '',
    phone: '',
    address: '',
    licenseNumber: '',
    experience: '',
    password: '',
  });
  const [viewDoctor, setViewDoctor] = useState(null);

  useEffect(() => {
    fetchDoctors();
    fetchPendingDoctors();
  }, []);

  // ... rest of the code unchanged, only the form dialog and API calls updated to include new fields

  const handleSaveDoctor = async () => {
    try {
      const token = localStorage.getItem('token');
      const method = newDoctor._id ? 'PUT' : 'POST';
      const url = newDoctor._id
        ? `http://localhost:8000/api/v1/doctors/${newDoctor._id}`
        : 'http://localhost:8000/api/v1/doctors/register';
      const bodyData = { ...newDoctor };
      if (!newDoctor._id) {
        if (!newDoctor.password) {
          setError('Password is required for new doctor registration');
          return;
        }
      } else {
        if (!newDoctor.password) {
          delete bodyData.password;
        }
      }
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to ${method === 'POST' ? 'add' : 'update'} doctor: ${text}`);
      }
      fetchDoctors();
      setOpenDialog(false);
      setNewDoctor({
        name: '',
        email: '',
        specialization: '',
        phone: '',
        address: '',
        licenseNumber: '',
        experience: '',
        password: '',
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Doctor Management
      </Typography>
      {error && <Typography color="error">{error}</Typography>}

      {/* Pending Doctors and Active Doctors tables unchanged */}

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2, mb: 2 }}
        onClick={() => {
          setNewDoctor({
            name: '',
            email: '',
            specialization: '',
            phone: '',
            address: '',
            licenseNumber: '',
            experience: '',
            password: '',
          });
          setOpenDialog(true);
        }}
      >
        Add Doctor
      </Button>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{newDoctor._id ? 'Edit Doctor' : 'Add Doctor'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={newDoctor.name}
            onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={newDoctor.email}
            onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
          />
          <TextField
            label="Specialization"
            fullWidth
            margin="normal"
            value={newDoctor.specialization}
            onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
          />
          <TextField
            label="Phone"
            fullWidth
            margin="normal"
            value={newDoctor.phone}
            onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })}
          />
          <TextField
            label="Address"
            fullWidth
            margin="normal"
            value={newDoctor.address}
            onChange={(e) => setNewDoctor({ ...newDoctor, address: e.target.value })}
          />
          <TextField
            label="License Number"
            fullWidth
            margin="normal"
            value={newDoctor.licenseNumber}
            onChange={(e) => setNewDoctor({ ...newDoctor, licenseNumber: e.target.value })}
          />
          <TextField
            label="Experience (years)"
            type="number"
            fullWidth
            margin="normal"
            value={newDoctor.experience}
            onChange={(e) => setNewDoctor({ ...newDoctor, experience: e.target.value })}
          />
          {!newDoctor._id && (
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={newDoctor.password}
              onChange={(e) => setNewDoctor({ ...newDoctor, password: e.target.value })}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveDoctor} color="primary">
            {newDoctor._id ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Doctor details view dialog unchanged */}
    </Box>
  );
};

export default DoctorManagement;
