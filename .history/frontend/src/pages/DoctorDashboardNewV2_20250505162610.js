import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DoctorDashboardNewV2 = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Updated to get userId from stored user object in localStorage
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  let doctorId = null;
  if (user) {
    try {
      const userObj = JSON.parse(user);
      doctorId = userObj._id || userObj.id || null;
    } catch {
      doctorId = null;
    }
  }

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8080/api/appointments/doctor/${doctorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAppointments(response.data);
      } catch (err) {
        setError('Failed to fetch appointments');
      } finally {
        setLoading(false);
      }
    };

    if (doctorId && token) {
      fetchAppointments();
    } else {
      setError('User not authenticated');
      setLoading(false);
    }
  }, [doctorId, token]);

  const updateAppointmentStatus = async (id, action, data = {}) => {
    try {
      await axios.put(
        `http://localhost:8080/api/appointments/${id}/${action}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refresh appointments after update
      const response = await axios.get(
        `http://localhost:8080/api/appointments/doctor/${doctorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAppointments(response.data);
    } catch (err) {
      setError('Failed to update appointment');
    }
  };

  if (loading) return <div>Loading appointments...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Doctor Dashboard</h1>
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <table border="1" cellPadding="8" cellSpacing="0">
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Status</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt._id}>
                <td>{appt.patientId}</td>
                <td>{new Date(appt.startTime).toLocaleString()}</td>
                <td>{new Date(appt.endTime).toLocaleString()}</td>
                <td>{appt.status}</td>
                <td>{appt.notes}</td>
                <td>
                  {appt.status === 'pending' && (
                    <button onClick={() => updateAppointmentStatus(appt._id, 'confirm')}>
                      Confirm
                    </button>
                  )}
                  {appt.status === 'confirmed' && (
                    <>
                      <button onClick={() => updateAppointmentStatus(appt._id, 'start')}>
                        Start
                      </button>
                      <button onClick={() => updateAppointmentStatus(appt._id, 'cancel', { reason: 'Cancelled by doctor' })}>
                        Cancel
                      </button>
                    </>
                  )}
                  {appt.status === 'confirmed' && (
                    <button onClick={() => updateAppointmentStatus(appt._id, 'complete', { notes: 'Completed successfully' })}>
                      Complete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DoctorDashboardNewV2;
