import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import Layout from './components/layout/Layout';
import './styles/App.css';

// Auth Pages
import LandingPage from './pages/auth/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import JoinUsPage from './pages/auth/JoinUsPage';

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import Appointments from './pages/Appointments';
import Messages from './pages/Messages';
import Prescriptions from './pages/Prescriptions';

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/join-us" element={<JoinUsPage />} />

          {/* Protected Routes */}
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<PatientDashboard />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="messages" element={<Messages />} />
            <Route path="prescriptions" element={<Prescriptions />} />
          </Route>

          {/* Doctor Routes */}
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/appointments" element={<Appointments />} />
          <Route path="/doctor/messages" element={<Messages />} />
          <Route path="/doctor/prescriptions" element={<Prescriptions />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
