import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import './AdminDashboard.css';

const AdminManagement = ({ userPermissions = [] }) => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ email: '', password: '' });

  useEffect(() => {
    if (userPermissions.includes('admin:list')) {
      fetchAdmins();
    }
  }, [userPermissions]);

  const fetchAdmins = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/v1/admins', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to fetch admins: ${text}`);
      }
      const data = await response.json();
      setAdmins(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/v1/admins', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAdmin),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to add admin: ${text}`);
      }
      fetchAdmins();
      setOpenDialog(false);
      setNewAdmin({ email: '', password: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Admin Management
      </Typography>
      {userPermissions.includes('admin:create') && (
        <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
          Add Admin
        </Button>
      )}
      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin._id}>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    {userPermissions.includes('admin:delete') && (
                      <Button color="error">Delete</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add Admin</DialogTitle>
        <DialogContent>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={newAdmin.email}
            onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={newAdmin.password}
            onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddAdmin} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminManagement;