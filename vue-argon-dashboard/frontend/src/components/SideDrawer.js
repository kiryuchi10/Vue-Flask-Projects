import React from 'react';
import { Drawer, IconButton, List, ListItem, ListItemText } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const SideDrawer = ({ open, onClose }) => (
  <Drawer anchor="left" open={open} onClose={onClose}>
    <div style={{ width: 250 }}>
      <IconButton onClick={onClose} style={{ margin: 16 }}>
        <CloseIcon />
      </IconButton>
      <List>
        <ListItem button>
          <ListItemText primary="Settings" />
        </ListItem>
        {/* Additional items can be added here */}
      </List>
    </div>
  </Drawer>
);

export default SideDrawer;
