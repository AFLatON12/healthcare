import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const location = useLocation();
  const role = location.state?.role || 'User';

  return (
    <div className="home-container">
      <h1>Hello, {role.charAt(0).toUpperCase() + role.slice(1)}!</h1>
      <p>Welcome to your home page.</p>
      <Link to="/login" className="btn-logout">Logout</Link>
    </div>
  );
}

export default HomePage;
