import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!role) {
      setError('Please select a role');
      return;
    }
    try {
      const response = await axios.post('/api/login', {
        email,
        password,
      });
      // Assuming backend returns role in response
      if (response.data.role !== role) {
        setError('Role does not match');
        return;
      }
      // Redirect to home page
      navigate('/home', { state: { role: response.data.role } });
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Login failed');
      }
    }
  };

  const handleSocialLogin = (provider) => {
    alert(`Social login with ${provider} is not implemented yet.`);
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="social-login-buttons">
        <button onClick={() => handleSocialLogin('Facebook')} className="btn-social facebook">Login with Facebook</button>
        <button onClick={() => handleSocialLogin('Google')} className="btn-social google">Login with Google</button>
      </div>
      <form onSubmit={handleSubmit} className="login-form">
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
        <div className="radio-group">
          <label>
            <input
              type="radio"
              value="patient"
              checked={role === 'patient'}
              onChange={(e) => setRole(e.target.value)}
            />
            Patient
          </label>
          <label>
            <input
              type="radio"
              value="doctor"
              checked={role === 'doctor'}
              onChange={(e) => setRole(e.target.value)}
            />
            Doctor
          </label>
        </div>
        <button type="submit" className="btn-submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
      <p>
        <Link to="/">Back to Welcome</Link>
      </p>
    </div>
  );
}

export default LoginPage;
