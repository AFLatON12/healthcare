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
  FormGroup,
  FormControlLabel,
  Checkbox,
  Tooltip,
} from '@mui/material';

const DoctorManagement = ({ userPermissions = [] }) => {
  const [doctors, setDoctors] = useState([]);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [newDoctor, setNewDoctor] = useState({ name: '', email: '', specialty: '', permissions: [] });
  const [viewDoctor, setViewDoctor] = useState(null);

  // Permissions list - can be fetched from backend if needed
  const permissionsList = [
    'doctor:list',
    'doctor:view',
    'doctor:approve',
    'doctor:reject',
    'doctor:update',
    'doctor:delete',
  ];

  useEffect(() => {
    fetchDoctors();
    fetchPendingDoctors();
  }, []);
<<<<<<< REPLACE
<<<<<<< SEARCH
          </TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {doctors.map((doctor) => (
          <TableRow key={doctor._id}>
            <TableCell>{doctor.name}</TableCell>
            <TableCell>{doctor.email}</TableCell>
            <TableCell>{doctor.specialty}</TableCell>
            <TableCell>{doctor.permissions?.join(', ') || 'No Permissions'}</TableCell>
            <TableCell>
              <Tooltip title={userPermissions.includes('doctor:view') ? '' : 'No permission to view'}>
                <span>
                  <Button
                    color="info"
                    onClick={() => {
                      setViewDoctor(doctor);
                      setViewDialog(true);
                    }}
                    disabled={!userPermissions.includes('doctor:view')}
                    sx={{ mr: 1 }}
                  >
                    View Details
                  </Button>
                </span>
              </Tooltip>
              <Tooltip title={userPermissions.includes('doctor:update') ? '' : 'No permission to edit'}>
                <span>
                  <Button
                    color="primary"
                    onClick={() => handleEdit(doctor)}
                    disabled={!userPermissions.includes('doctor:update')}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                </span>
              </Tooltip>
              <Tooltip title={userPermissions.includes('doctor:delete') ? '' : 'No permission to delete'}>
                <span>
                  <Button
                    color="error"
                    onClick={() => handleDelete(doctor._id)}
                    disabled={!userPermissions.includes('doctor:delete')}
                  >
                    Delete
                  </Button>
                </span>
              </Tooltip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
=======
          </TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {doctors.map((doctor) => (
          <TableRow key={doctor._id}>
            <TableCell>{doctor.name}</TableCell>
            <TableCell>{doctor.email}</TableCell>
            <TableCell>{doctor.specialty}</TableCell>
            <TableCell>{doctor.permissions?.join(', ') || 'No Permissions'}</TableCell>
            <TableCell>
              <Tooltip title={userPermissions.includes('doctor:view') ? '' : 'No permission to view'}>
                <span>
                  <Button
                    color="info"
                    onClick={() => {
                      setViewDoctor(doctor);
                      setViewDialog(true);
                    }}
                    disabled={!userPermissions.includes('doctor:view')}
                    sx={{ mr: 1 }}
                  >
                    View Details
                  </Button>
                </span>
              </Tooltip>
              <Tooltip title={userPermissions.includes('doctor:update') ? '' : 'No permission to edit'}>
                <span>
                  <Button
                    color="primary"
                    onClick={() => handleEdit(doctor)}
                    disabled={!userPermissions.includes('doctor:update')}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                </span>
              </Tooltip>
              <Tooltip title={userPermissions.includes('doctor:delete') ? '' : 'No permission to delete'}>
                <span>
                  <Button
                    color="error"
                    onClick={() => handleDelete(doctor._id)}
                    disabled={!userPermissions.includes('doctor:delete')}
                  >
                    Delete
                  </Button>
                </span>
              </Tooltip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>

  const fetchDoctors = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
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
      specialty: doctor.specialty || '',
      permissions: doctor.permissions || [],
      _id: doctor._id,
    });
    setOpenDialog(true);
  };

  const handlePermissionChange = (permission) => {
    setNewDoctor((prev) => {
      const updatedPermissions = prev.permissions.includes(permission)
        ? prev.permissions.filter((perm) => perm !== permission)
        : [...prev.permissions, permission];
      return { ...prev, permissions: updatedPermissions };
    });
  };

  const handleSaveDoctor = async () => {
    try {
      const token = localStorage.getItem('token');
      const method = newDoctor._id ? 'PUT' : 'POST';
      const url = newDoctor._id
        ? `http://localhost:8000/api/v1/doctors/${newDoctor._id}`
        : 'http://localhost:8000/api/v1/doctors';
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDoctor),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to ${method === 'POST' ? 'add' : 'update'} doctor: ${text}`);
      }
      fetchDoctors();
      setOpenDialog(false);
      setNewDoctor({ name: '', email: '', specialty: '', permissions: [] });
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
              <TableCell>Specialty</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingDoctors.map((doctor) => (
              <TableRow key={doctor._id}>
                <TableCell>{doctor.name}</TableCell>
                <TableCell>{doctor.email}</TableCell>
                <TableCell>{doctor.specialty}</TableCell>
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
              <TableCell>Specialty</TableCell>
              <TableCell>Permissions</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {doctors.map((doctor) => (
              <TableRow key={doctor._id}>
                <TableCell>{doctor.name}</TableCell>
                <TableCell>{doctor.email}</TableCell>
                <TableCell>{doctor.specialty}</TableCell>
                <TableCell>{doctor.permissions?.join(', ') || 'No Permissions'}</TableCell>
                <TableCell>
                  <Tooltip title={userPermissions.includes('doctor:update') ? '' : 'No permission to edit'}>
                    <span>
                      <Button
                        color="primary"
                        onClick={() => handleEdit(doctor)}
                        disabled={!userPermissions.includes('doctor:update')}
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                    </span>
                  </Tooltip>
                  <Tooltip title={userPermissions.includes('doctor:delete') ? '' : 'No permission to delete'}>
                    <span>
                      <Button
                        color="error"
                        onClick={() => handleDelete(doctor._id)}
                        disabled={!userPermissions.includes('doctor:delete')}
                      >
                        Delete
                      </Button>
                    </span>
                  </Tooltip>
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
          setNewDoctor({ name: '', email: '', specialty: '', permissions: [] });
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
            label="Specialty"
            fullWidth
            margin="normal"
            value={newDoctor.specialty}
            onChange={(e) => setNewDoctor({ ...newDoctor, specialty: e.target.value })}
          />
          <Typography variant="subtitle1" gutterBottom>
            Assign Permissions:
          </Typography>
          <FormGroup>
            {permissionsList.map((permission) => (
              <FormControlLabel
                key={permission}
                control={
                  <Checkbox
                    checked={newDoctor.permissions.includes(permission)}
                    onChange={() => handlePermissionChange(permission)}
                  />
                }
                label={permission}
              />
            ))}
          </FormGroup>
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
          <Typography><strong>Specialty:</strong> {viewDoctor?.specialty}</Typography>
          <Typography><strong>Permissions:</strong> {viewDoctor?.permissions?.join(', ') || 'No Permissions'}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DoctorManagement;
