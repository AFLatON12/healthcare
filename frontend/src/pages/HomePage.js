import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/HomePage.css';

function HomePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Implement login logic here
    console.log('Login attempt with:', formData);
  };

  const handleSocialLogin = (provider) => {
    // Implement social login logic here
    console.log(`Login with ${provider}`);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <div className="divider">
          <span>or continue with</span>
        </div>

        <div className="social-login">
          <button
            className="social-button google"
            onClick={() => handleSocialLogin('Google')}
          >
            <img src="/google-icon.png" alt="Google" />
            Google
          </button>

          <button
            className="social-button facebook"
            onClick={() => handleSocialLogin('Facebook')}
          >
            <img src="/facebook-icon.png" alt="Facebook" />
            Facebook
          </button>
        </div>

        <div className="signup-options">
          <p>Don't have an account?</p>
          <div className="signup-links">
            <Link to="/signup" className="signup-link">Sign up</Link>
            <span>or</span>
            <Link to="/join-us" className="doctor-link">Join as Doctor</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
