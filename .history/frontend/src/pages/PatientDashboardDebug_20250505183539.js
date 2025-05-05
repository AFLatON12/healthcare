import React, { useEffect } from 'react';

const PatientDashboardDebug = () => {
  useEffect(() => {
    const patientId = localStorage.getItem('patientId');
    console.log('Debug: patientId from localStorage:', patientId);
  }, []);

  return (
    <div>
      <h1>Patient Dashboard Debug</h1>
      <p>Check console for patientId value in localStorage.</p>
    </div>
  );
};

export default PatientDashboardDebug;
