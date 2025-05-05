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

  const fetchDoctors = async () => {
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/v1/doctors', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to fetch doctors: ${text}`);
      }
      const data = await response.json();
      setDoctors(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchPendingDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/v1/doctors/pending', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to fetch pending doctors: ${text}`);
      }
      const data = await response.json();
      setPendingDoctors(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleApprove = async (doctorId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/v1/doctors/${doctorId}/approve`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to approve doctor: ${text}`);
      }
      fetchDoctors();
      fetchPendingDoctors();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReject = async (doctorId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/v1/doctors/${doctorId}/reject`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to reject doctor: ${text}`);
      }
      fetchPendingDoctors();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (doctorId) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/v1/doctors/${doctorId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to delete doctor: ${text}`);
      }
      fetchDoctors();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (doctor) => {
    setNewDoctor({
      name: doctor.name || '',
      email: doctor.email || '',
      specialization: doctor.specialization || '',
      phone: doctor.phone || '',
      address: doctor.address || '',
      licenseNumber: doctor.licenseNumber || '',
      experience: doctor.experience || '',
      password: '',
      _id: doctor._id,
    });
    setOpenDialog(true);
  };

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

      <Typography variant="h6" sx={{ mt: 2 }}>
        Pending Doctors
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 1, mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Specialization</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingDoctors.map((doctor) => (
              <TableRow key={doctor._id}>
                <TableCell>{doctor.name}</TableCell>
                <TableCell>{doctor.email}</TableCell>
                <TableCell>{doctor.specialization}</TableCell>
                <TableCell>
                  <Tooltip title={userPermissions.includes('doctor:approve') ? '' : 'No permission to approve'}>
                    <span>
                      <Button
                        color="primary"
                        onClick={() => handleApprove(doctor._id)}
                        disabled={!userPermissions.includes('doctor:approve')}
                        sx={{ mr: 1 }}
                      >
                        Approve
                      </Button>
                    </span>
                  </Tooltip>
                  <Tooltip title={userPermissions.includes('doctor:reject') ? '' : 'No permission to reject'}>
                    <span>
                      <Button
                        color="error"
                        onClick={() => handleReject(doctor._id)}
                        disabled={!userPermissions.includes('doctor:reject')}
                      >
                        Reject
                      </Button>
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" sx={{ mt: 2 }}>
        Active Doctors
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Specialization</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>License Number</TableCell>
              <TableCell>Experience</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {doctors.map((doctor) => (
              <TableRow key={doctor._id}>
                <TableCell>{doctor.name}</TableCell>
                <TableCell>{doctor.email}</TableCell>
                <TableCell>{doctor.specialization}</TableCell>
                <TableCell>{doctor.phone}</TableCell>
                <TableCell>{doctor.address}</TableCell>
                <TableCell>{doctor.licenseNumber}</TableCell>
                <TableCell>{doctor.experience}</TableCell>
                <TableCell>
                  <Button
                    color="info"
                    onClick={() => {
                      setViewDoctor(doctor);
                      setViewDialog(true);
                    }}
                    sx={{ mr: 1 }}
                  >
                    View Details
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => handleEdit(doctor)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    color="error"
                    onClick={() => handleDelete(doctor._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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

      <Dialog open={viewDialog} onClose={() => setViewDialog(false)}>
        <DialogTitle>Doctor Details</DialogTitle>
        <DialogContent>
          <Typography><strong>Name:</strong> {viewDoctor?.name}</Typography>
          <Typography><strong>Email:</strong> {viewDoctor?.email}</Typography>
          <Typography><strong>Specialization:</strong> {viewDoctor?.specialization}</Typography>
          <Typography><strong>Phone:</strong> {viewDoctor?.phone}</Typography>
          <Typography><strong>Address:</strong> {viewDoctor?.address}</Typography>
          <Typography><strong>License Number:</strong> {viewDoctor?.licenseNumber}</Typography>
          <Typography><strong>Experience:</strong> {viewDoctor?.experience}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DoctorManagement;
