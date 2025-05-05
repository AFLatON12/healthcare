import React from 'react';
import { Typography, List, ListItem, ListItemText } from '@mui/material';

function MedicalHistoryList({ medicalHistory }) {
  if (!medicalHistory || medicalHistory.length === 0) {
    return <Typography>No medical history available.</Typography>;
  }

  return (
    <>
      <Typography variant="h6">Medical History</Typography>
      <List>
        {medicalHistory.map((entry, index) => (
          <ListItem key={index}>
            <ListItemText primary={entry} />
          </ListItem>
        ))}
      </List>
    </>
  );
}

export default MedicalHistoryList;
