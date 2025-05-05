import React, { useState, useEffect } from 'react';
import { Typography, Box, Table, TableHead, TableRow, TableCell, TableBody, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';

const DoctorScheduleManagement = () => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newTimeSlot, setNewTimeSlot] = useState({ startTime: '', endTime: '', isAvailable: true });

  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/doctor-schedule');
        setTimeSlots(response.data.timeSlots);
      } catch (error) {
        console.error('Failed to fetch time slots:', error);
      }
    };

    fetchTimeSlots();
  }, []);

  const handleAddTimeSlot = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/doctor-schedule', newTimeSlot);
      setTimeSlots([...timeSlots, response.data]);
      setOpenDialog(false);
      setNewTimeSlot({ startTime: '', endTime: '', isAvailable: true });
    } catch (error) {
      console.error('Failed to add time slot:', error);
    }
  };

  const handleDeleteTimeSlot = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/doctor-schedule/${id}`);
      setTimeSlots(response.data);
    } catch (error) {
      console.error('Failed to delete time slot:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h6">Doctor Schedule Management</Typography>
      <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
        Add Time Slot
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Start Time</TableCell>
            <TableCell>End Time</TableCell>
            <TableCell>Available</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {timeSlots.map((slot) => (
            <TableRow key={slot._id}>
              <TableCell>{new Date(slot.startTime).toLocaleString()}</TableCell>
              <TableCell>{new Date(slot.endTime).toLocaleString()}</TableCell>
              <TableCell>{slot.isAvailable ? 'Yes' : 'No'}</TableCell>
              <TableCell>
                <Button color="error" onClick={() => handleDeleteTimeSlot(slot._id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add Time Slot</DialogTitle>
        <DialogContent>
          <TextField
            label="Start Time"
            type="datetime-local"
            fullWidth
            value={newTimeSlot.startTime}
            onChange={(e) => setNewTimeSlot({ ...newTimeSlot, startTime: e.target.value })}
            margin="normal"
          />
          <TextField
            label="End Time"
            type="datetime-local"
            fullWidth
            value={newTimeSlot.endTime}
            onChange={(e) => setNewTimeSlot({ ...newTimeSlot, endTime: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddTimeSlot} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DoctorScheduleManagement;