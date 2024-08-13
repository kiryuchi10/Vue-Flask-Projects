import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import AlarmIcon from '@mui/icons-material/Alarm';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';
import './AppBar.css'; // Import your AppBar CSS if necessary

const AppBarComponent = ({ onSettingsClick }) => {
  const navigate = useNavigate();

  return (
    <AppBar position="fixed" sx={{ bgcolor: '#1976d2', boxShadow: 3, width: '100%' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Left side - Settings Icon */}
        <IconButton color="inherit" onClick={onSettingsClick}>
          <SettingsIcon />
        </IconButton>

        {/* Center - App Name */}
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <Typography variant="h6" sx={{ color: 'white' }}>
            My App
          </Typography>
        </Box>

        {/* Right side - Alarm Icon */}
        <IconButton color="inherit" onClick={() => navigate('/notifications')}>
          <AlarmIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;
