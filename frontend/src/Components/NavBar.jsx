import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import AddCircleOutline from '@mui/icons-material/AddCircle';
import apiClient from '../axios';

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');

  // Open the dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Close the dialog
  const handleClose = () => {
    setOpen(false);
    setCategoryName('');
  };


  const handleSubmit = () => {
    apiClient.post('/categories', { name: 'Electronics adasd' })
    .then(response => {
        console.log('Category created successfully:', response.data);
    })
    .catch(error => {
        console.error('Error creating category:', error);
    });
};

  return (
    <AppBar position="static" color="white" sx={{ boxShadow: 'none', borderBottom: '1px solid #ccc' }}>
      <Toolbar>
        {/* App Title */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            BuyNest
          </Link>
        </Typography>

        {/* Buttons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" sx={{ textTransform: 'none' }} onClick={handleClickOpen}>
            <AddCircleOutline fontSize="small" sx={{ marginRight: 1 }} />
            Add Category
          </Button>
          <Button color="inherit" sx={{ textTransform: 'none' }}>
            <Link
              to="/add-product"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <AddCircleOutline fontSize="small" sx={{ marginRight: 1 }} />
              Add Product
            </Link>
          </Button>
          <Button color="inherit" sx={{ textTransform: 'none' }}>
            <Link
              to="/logout"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <LogoutIcon fontSize="small" sx={{ marginRight: 1 }} />
              Logout
            </Link>
          </Button>
        </Box>
      </Toolbar>

      {/* Add Category Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the name of the new category.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="categoryName"
            label="Category Name"
            type="text"
            fullWidth
            variant="standard"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default NavBar;
