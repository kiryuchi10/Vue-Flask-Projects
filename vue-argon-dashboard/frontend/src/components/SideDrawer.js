// SideDrawer.jsx
import React from 'react';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';

const SideDrawer = ({ open, onClose }) => {
  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <List>
        <ListItem button onClick={onClose}>
          <ListItemText primary="Item 1" />
        </ListItem>
        <ListItem button onClick={onClose}>
          <ListItemText primary="Item 2" />
        </ListItem>
        {/* Add more items as needed */}
      </List>
    </Drawer>
  );
};

export default SideDrawer;
