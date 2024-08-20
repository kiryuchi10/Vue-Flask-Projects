import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a Context for the user
const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Fetch user data from an API or local storage
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('authToken'); // Example token retrieval
        if (token) {
          const response = await fetch('/check-login', { // Adjust endpoint as needed
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`, // Example token
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  // Function to log in a user
  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('authToken', token); // Store the token
  };

  // Function to log out a user
  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken'); // Remove the token
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);
