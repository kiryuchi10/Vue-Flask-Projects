// src/components/SearchBar.js
import React from 'react';
import { TextField } from '@mui/material';

const SearchBar = () => {
  return (
    <TextField
      variant="outlined"
      fullWidth
      placeholder="Search..."
    />
  );
};

export default SearchBar;
