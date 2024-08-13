// src/components/SystemBar.js

import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { Menu as MenuIcon, Alarm as AlarmIcon } from '@mui/icons-material';

const SystemBar = ({ onMenuClick }) => (
  <AppBar position="fixed">
    <Toolbar>
      <IconButton edge="start" color="inherit" aria-label="menu" onClick={onMenuClick}>
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" style={{ flexGrow: 1 }}>
        MyApp
      </Typography>
      <IconButton edge="end" color="inherit" aria-label="alarm">
        <AlarmIcon />
      </IconButton>
    </Toolbar>
  </AppBar>
);

export default SystemBar;
