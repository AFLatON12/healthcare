import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignupPage.css';

function SignupPage() {
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!role) {
      setError('Please select a role');
      return;
    }

    const userData = {
      name,
      email,
      password,
      role,
    };

    if (role === 'patient') {
      if (!phone || !gender || !dob) {
        setError('Please fill all required fields for patient');
        return;
      }
      userData.phone = phone;
      userData.gender = gender;
      userData.dob = dob;
    } else if (role === 'doctor') {
      if (!licenseNumber || !specialization) {
        setError('Please fill all required fields for doctor');
        return;
      }
      userData.licenseNumber = licenseNumber;
      userData.specialization = specialization;
    }

    try {
      const response = await axios.post('/api/register', userData);
      setSuccess(response.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Registration failed');
      }
    }
  };

  return (
    <div className="signup-container">
      <h1>Sign Up</h1>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="radio-group">
          <label>
            <input
              type="radio"
              value="patient"
              checked={role === 'patient'}
              onChange={(e) => setRole(e.target.value)}
              required
            />
            Patient
          </label>
          <label>
            <input
              type="radio"
              value="doctor"
              checked={role === 'doctor'}
              onChange={(e) => setRole(e.target.value)}
              required
            />
            Doctor
          </label>
        </div>
        {role && (
          <>
            <label>
              Name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <label>
              Confirm Password:
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </label>
            {role === 'patient' && (
              <>
                <label>
                  Phone Number:
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Gender:
                  <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </label>
                <label>
                  Date of Birth:
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                  />
                </label>
              </>
            )}
            {role === 'doctor' && (
              <>
                <label>
                  License Number:
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Specialization:
                  <input
                    type="text"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    required
                  />
                </label>
              </>
            )}
            <button type="submit" className="btn-submit">Sign Up</button>
          </>
        )}
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
      <p>
        <Link to="/">Back to Welcome</Link>
      </p>
    </div>
  );
}

export default SignupPage;
