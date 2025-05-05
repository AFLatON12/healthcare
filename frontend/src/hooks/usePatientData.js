import { useState, useEffect } from 'react';
import { fetchPatientById } from '../api/auth';

function usePatientData(patientId) {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPatient() {
      try {
        if (!patientId) {
          setError('Patient ID is missing');
          setLoading(false);
          return;
        }
        const data = await fetchPatientById(patientId);
        setPatient(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadPatient();
  }, [patientId]);

  const updatePatient = (updatedData) => {
    setPatient(prev => ({ ...prev, ...updatedData }));
  };

  return { patient, loading, error, updatePatient };
}

export default usePatientData;
