import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext'; // Adjust path as needed
import './AppBar.css';

const AppBar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Handle case where useUser might return null
  const { user } = useUser() || {}; // Safe destructuring

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <header className="app-bar">
      <button className="drawer-toggle" onClick={toggleDrawer} aria-label="Toggle menu">
        ☰
      </button>
      <div className="logo">GoYeBang</div>
      <button className="notification-icon" aria-label="Notifications">
        🔔
      </button>
      <div className={`side-drawer ${drawerOpen ? 'open' : ''}`}>
        <button className="drawer-close" onClick={toggleDrawer} aria-label="Close menu">
          &times;
        </button>
        <nav className="nav-links">
          <Link to="/mainpage">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/services">Services</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </div>
    </header>
  );
};

export default AppBar;
