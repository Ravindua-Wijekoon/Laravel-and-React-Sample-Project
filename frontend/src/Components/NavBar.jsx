import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const NavBar = () => {
  return (
    <AppBar 
      position="static" 
      sx={{
        boxShadow: 'none', 
        backgroundColor: '#363847', 
        borderBottom:'3px solidrgb(26, 98, 180)',
      }}>
        <Toolbar>
          <Typography variant="h5" fontWeight={'bold'} color='white' sx={{ flexGrow: 1 }}>
            BuyNest
          </Typography>
        </Toolbar>
    </AppBar>
  );
};

export default NavBar;
