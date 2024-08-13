import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext'; // Adjust path as needed
import './AppBar.css';

const AppBar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const user = useUser(); // Get the current user from context

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <header className="app-bar">
      <button className="drawer-toggle" onClick={toggleDrawer}>
        ☰
      </button>
      <div className="logo">GoYeBang</div>
      {user && (
        <div className="user-info">
          <span>Welcome, {user.name}</span>
        </div>
      )}
      <button className="notification-icon">
        🔔
      </button>
      <div className={`side-drawer ${drawerOpen ? 'open' : ''}`}>
        <button className="drawer-close" onClick={toggleDrawer}>
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
