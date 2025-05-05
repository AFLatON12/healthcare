import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Dialog, DialogActions, DialogContent, DialogTitle, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import './AdminDashboard.css';

const AdminManagement = ({ userPermissions = [] }) => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ email: '', password: '', permissions: [] });

  const [permissionsList, setPermissionsList] = useState([
    'admin:create',
    'admin:list',
    'admin:view',
    'admin:update',
    'admin:delete',
    'doctor:list',
    'doctor:view',
    'patient:list',
    'patient:view',
    'system:config',
    'system:metrics',
    'system:logs',
  ]);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/api/v1/permissions', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch permissions');
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setPermissionsList(data);
        }
      } catch (err) {
        console.error('Error fetching permissions:', err);
      }
    };
    fetchPermissions();
  }, []);

  const handlePermissionChange = (permission) => {
    setNewAdmin((prev) => {
      const updatedPermissions = prev.permissions.includes(permission)
        ? prev.permissions.filter((perm) => perm !== permission)
        : [...prev.permissions, permission];
      return { ...prev, permissions: updatedPermissions };
    });
  };

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
      const method = newAdmin._id ? 'PUT' : 'POST';
      const url = newAdmin._id
        ? `http://localhost:8000/api/v1/admins/${newAdmin._id}`
        : 'http://localhost:8000/api/v1/admins';

      // Prepare payload, omit password if empty on update
      const payload = { ...newAdmin };
      if (newAdmin._id && !newAdmin.password) {
        delete payload.password;
      }

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to ${method === 'POST' ? 'add' : 'update'} admin: ${text}`);
      }
      fetchAdmins();
      setOpenDialog(false);
      setNewAdmin({ email: '', password: '', permissions: [] });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Admin Management
      </Typography>
      {/* Temporarily show Add Admin button unconditionally for testing */}
      <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
        Add Admin
      </Button>
      {/*
      {userPermissions.includes('admin:create') && (
        <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
          Add Admin
        </Button>
      )}
      */}
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
                <TableCell>Permissions</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin._id}>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{admin.permissions?.join(', ') || 'No Permissions'}</TableCell>
                  <TableCell>
                  {userPermissions.includes('admin:update') && (
                    <Button
                      color="primary"
                      onClick={() => {
                        setNewAdmin({
                          email: admin.email,
                          password: '',
                          permissions: admin.permissions || [],
                          _id: admin._id,
                        });
                        setOpenDialog(true);
                      }}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                  )}
                  {userPermissions.includes('admin:delete') && (
                    <Button
                      color="error"
                      onClick={async () => {
                        if (window.confirm('Are you sure you want to delete this admin?')) {
                          try {
                            const token = localStorage.getItem('token');
                            const response = await fetch(`http://localhost:8000/api/v1/admins/${admin._id}`, {
                              method: 'DELETE',
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                            });
                            if (!response.ok) {
                              const text = await response.text();
                              throw new Error(`Failed to delete admin: ${text}`);
                            }
                            fetchAdmins();
                          } catch (err) {
                            setError(err.message);
                          }
                        }
                      }}
                    >
                      Delete
                    </Button>
                  )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
      <DialogTitle>{newAdmin._id ? 'Edit Admin' : 'Add Admin'}</DialogTitle>
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
          helperText={newAdmin._id ? 'Leave blank to keep current password' : ''}
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
                  checked={newAdmin.permissions.includes(permission)}
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
        <Button onClick={handleAddAdmin} color="primary">
          {newAdmin._id ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
    </Box>
  );
};

export default AdminManagement;