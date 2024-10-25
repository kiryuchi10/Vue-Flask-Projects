import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import './AppBar.css';

const AppBar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user } = useUser() || {};

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
          <div className="user-info">
            {<p>Hello, {user?.user_name}</p>}
          </div>
          <Link to="/mainpage">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/services">Services</Link> {/* Link to Services */}
          <Link to="/contact">Contact</Link>
        </nav>
      </div>
    </header>
  );
};

export default AppBar;
