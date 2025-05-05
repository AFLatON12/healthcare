import React, { useState } from 'react';
import { TextField, Button, Box, List, ListItem, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function MedicalHistoryForm({ medicalHistory, onSave, onCancel }) {
  const [entries, setEntries] = useState(medicalHistory || ['']);
  const [newEntry, setNewEntry] = useState('');

  const handleEntryChange = (index, value) => {
    const updatedEntries = [...entries];
    updatedEntries[index] = value;
    setEntries(updatedEntries);
  };

  const handleAddEntry = () => {
    if (newEntry.trim() !== '') {
      setEntries([...entries, newEntry.trim()]);
      setNewEntry('');
    }
  };

  const handleDeleteEntry = (index) => {
    const updatedEntries = entries.filter((_, i) => i !== index);
    setEntries(updatedEntries);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(entries.filter(entry => entry.trim() !== ''));
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <List>
        {entries.map((entry, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteEntry(index)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <TextField
              fullWidth
              value={entry}
              onChange={(e) => handleEntryChange(index, e.target.value)}
              variant="standard"
            />
          </ListItem>
        ))}
      </List>
      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
        <TextField
          fullWidth
          label="Add new entry"
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          variant="outlined"
        />
        <Button variant="contained" onClick={handleAddEntry}>Add</Button>
      </Box>
      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Button variant="contained" type="submit">Save</Button>
        <Button variant="outlined" onClick={onCancel}>Cancel</Button>
      </Box>
    </Box>
  );
}

export default MedicalHistoryForm;
