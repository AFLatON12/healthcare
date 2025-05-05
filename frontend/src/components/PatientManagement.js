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

const PatientManagement = ({ userPermissions = [] }) => {
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    insuranceProvider: '',
    password: '',
  });
  const [viewPatient, setViewPatient] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/v1/patients', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to fetch patients: ${text}`);
      }
      const data = await response.json();
      setPatients(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (patientId) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/v1/patients/${patientId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to delete patient: ${text}`);
      }
      fetchPatients();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (patient) => {
    setNewPatient({
      name: patient.name || '',
      email: patient.email || '',
      phone: patient.phone || '',
      address: patient.address || '',
      dateOfBirth: patient.dateOfBirth ? patient.dateOfBirth.substring(0, 10) : '',
      gender: patient.gender || '',
      insuranceProvider: patient.insuranceProvider || '',
      password: '',
      _id: patient._id,
    });
    setOpenDialog(true);
  };

  const handleSavePatient = async () => {
    try {
      const token = localStorage.getItem('token');
      const method = newPatient._id ? 'PUT' : 'POST';
      const url = newPatient._id
        ? `http://localhost:8000/api/v1/patients/${newPatient._id}`
        : 'http://localhost:8000/api/v1/patients/register';
      const bodyData = { ...newPatient };
      if (!newPatient._id) {
        if (!newPatient.password) {
          setError('Password is required for new patient registration');
          return;
        }
      } else {
        if (!newPatient.password) {
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
        throw new Error(`Failed to ${method === 'POST' ? 'add' : 'update'} patient: ${text}`);
      }
      fetchPatients();
      setOpenDialog(false);
      setNewPatient({
        name: '',
        email: '',
        phone: '',
        address: '',
        dateOfBirth: '',
        gender: '',
        insuranceProvider: '',
        password: '',
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Patient Management
      </Typography>
      {error && <Typography color="error">{error}</Typography>}

      <TableContainer component={Paper} sx={{ mt: 1, mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Insurance Provider</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient._id}>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>{patient.phone}</TableCell>
                <TableCell>{patient.address}</TableCell>
                <TableCell>{patient.dateOfBirth ? patient.dateOfBirth.substring(0, 10) : ''}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>{patient.insuranceProvider}</TableCell>
                <TableCell>
                  <Button
                    color="info"
                    onClick={() => {
                      setViewPatient(patient);
                      setViewDialog(true);
                    }}
                    sx={{ mr: 1 }}
                  >
                    View Details
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => handleEdit(patient)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    color="error"
                    onClick={() => handleDelete(patient._id)}
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
          setNewPatient({
            name: '',
            email: '',
            phone: '',
            address: '',
            dateOfBirth: '',
            gender: '',
            insuranceProvider: '',
            password: '',
          });
          setOpenDialog(true);
        }}
      >
        Add Patient
      </Button>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{newPatient._id ? 'Edit Patient' : 'Add Patient'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={newPatient.name}
            onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={newPatient.email}
            onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
          />
          <TextField
            label="Phone"
            fullWidth
            margin="normal"
            value={newPatient.phone}
            onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
          />
          <TextField
            label="Address"
            fullWidth
            margin="normal"
            value={newPatient.address}
            onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
          />
          <TextField
            label="Date of Birth"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={newPatient.dateOfBirth}
            onChange={(e) => setNewPatient({ ...newPatient, dateOfBirth: e.target.value })}
          />
          <TextField
            label="Gender"
            fullWidth
            margin="normal"
            value={newPatient.gender}
            onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
          />
          <TextField
            label="Insurance Provider"
            fullWidth
            margin="normal"
            value={newPatient.insuranceProvider}
            onChange={(e) => setNewPatient({ ...newPatient, insuranceProvider: e.target.value })}
          />
          {!newPatient._id && (
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={newPatient.password}
              onChange={(e) => setNewPatient({ ...newPatient, password: e.target.value })}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSavePatient} color="primary">
            {newPatient._id ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={viewDialog} onClose={() => setViewDialog(false)}>
        <DialogTitle>Patient Details</DialogTitle>
        <DialogContent>
          <Typography><strong>Name:</strong> {viewPatient?.name}</Typography>
          <Typography><strong>Email:</strong> {viewPatient?.email}</Typography>
          <Typography><strong>Phone:</strong> {viewPatient?.phone}</Typography>
          <Typography><strong>Address:</strong> {viewPatient?.address}</Typography>
          <Typography><strong>Date of Birth:</strong> {viewPatient?.dateOfBirth ? viewPatient.dateOfBirth.substring(0, 10) : ''}</Typography>
          <Typography><strong>Gender:</strong> {viewPatient?.gender}</Typography>
          <Typography><strong>Insurance Provider:</strong> {viewPatient?.insuranceProvider}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientManagement;
