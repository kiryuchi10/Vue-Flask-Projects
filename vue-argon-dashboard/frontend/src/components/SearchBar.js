// src/components/SearchBar.js
import React from 'react';
import { TextField } from '@mui/material';

const SearchBar = () => {
  return (
    <TextField
      variant="outlined"
      fullWidth
      placeholder="오늘은 뭐할까?"
    />
  );
};

export default SearchBar;
