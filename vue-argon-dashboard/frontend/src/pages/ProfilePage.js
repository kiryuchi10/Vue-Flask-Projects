import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css'; // Optional: import CSS for styling

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/check-login', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Example token
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      // Perform logout logic
      localStorage.removeItem('authToken'); // Remove the token

      // Optionally, you might want to make an API call to invalidate the session on the server
      // await fetch('/logout', { method: 'POST' });

      // Clear user from state
      setUser(null);

      // Redirect to login page
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  if (loading) {
    return <div className="profile-page">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="profile-page">
        <h2>Profile Page</h2>
        <p>You are not logged in.</p>
        <button onClick={handleLoginRedirect}>Go to Login</button>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <h2>Profile Page</h2>
      <div className="user-info">
        <p><strong>Name:</strong> {user.user_name}</p>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;