import React from 'react';
import { BottomNavigation, BottomNavigationAction, Box } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; // Import Calendar icon
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const BottomNav = () => {
  const navigate = useNavigate(); // Initialize navigate function

  // Function to handle navigation when the Profile icon is clicked
  const handleProfileClick = () => {
    navigate('/profilepage'); // Navigate to the Profile page
  };

  // Function to handle navigation when the Go button is clicked
  const handleGoClick = () => {
    navigate('/mainpagewithextras'); // Navigate to the MainPageWithExtras
  };

  const handleHomeClick = () => {
    navigate('/mainpage'); // Navigate to MainPage
  };

  // Function to handle navigation when the Calendar icon is clicked
  const handleCalendarClick = () => {
    navigate('/calendar'); // Navigate to the Calendar page
  };

  return (
    <BottomNavigation
      showLabels
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: '#ffffff', // White background for the bottom navigation
        boxShadow: 3, // Adds a shadow for separation
        borderTop: '1px solid #e0e0e0', // Light border for visual separation
      }}
    >
      <BottomNavigationAction
        label="Calendar"
        icon={<CalendarTodayIcon />} // Use Calendar icon
        onClick={handleCalendarClick} // Add click handler for Calendar
      />
      <BottomNavigationAction
        label="Home"
        icon={<HomeIcon />}
        onClick={handleHomeClick}
      />
      <BottomNavigationAction
        icon={
          <Box
            sx={{
              bgcolor: '#FF4081',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            Go
          </Box>
        }
        onClick={handleGoClick} // Add click handler for Go button
      />
      <BottomNavigationAction
        label="Favorites"
        icon={<FavoriteIcon />}
      />
      <BottomNavigationAction
        label="Profile"
        icon={<PersonIcon />}
        onClick={handleProfileClick}
      />
    </BottomNavigation>
  );
};

export default BottomNav;
