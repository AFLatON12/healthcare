import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
    <Router>
      <div className="App">
        <Routes>
          {/* Auth Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/join-us" element={<JoinUsPage />} />

          {/* Patient Routes */}
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/appointments" element={<Appointments />} />
          <Route path="/patient/messages" element={<Messages />} />
          <Route path="/patient/prescriptions" element={<Prescriptions />} />

          {/* Doctor Routes */}
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/appointments" element={<Appointments />} />
          <Route path="/doctor/messages" element={<Messages />} />
          <Route path="/doctor/prescriptions" element={<Prescriptions />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
