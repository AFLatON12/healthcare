import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import DoctorManagement from './DoctorManagement';
import PatientManagement from './PatientManagement';

const SystemManagement = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box>
      <Tabs value={tabIndex} onChange={handleChange}>
        <Tab label="Doctors" />
        <Tab label="Patients" />
      </Tabs>
      <Box>
        {tabIndex === 0 && <DoctorManagement />}
        {tabIndex === 1 && <PatientManagement />}
      </Box>
    </Box>
  );
};

export default SystemManagement;
