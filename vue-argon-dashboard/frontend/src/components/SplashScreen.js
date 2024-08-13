// src/components/SplashScreen.js
import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

const SplashScreen = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#fff',
        position: 'absolute',
        width: '100%',
        top: 0,
        left: 0,
        zIndex: 9999,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Welcome to MyApp
      </Typography>
      <CircularProgress color="primary" />
    </Box>
  );
};

export default SplashScreen;
