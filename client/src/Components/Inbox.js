import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Redirect to login
    navigate('/login');
  };

  return (
    <div className="layout">
      <header className="main-header">
        <div className="header-content">
          <div className="logo-section">
            <img src="/adviselink-logo.png" alt="AdviseLink" className="header-logo" />
            <h1>AdviseLink</h1>
          </div>
          
          <nav className="main-nav">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
          </nav>

          <button onClick={handleLogout} className="logout-button">
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </header>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;