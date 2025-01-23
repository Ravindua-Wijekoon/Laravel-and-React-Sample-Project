import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';

const AddCategoryDialog = ({
  open,
  onClose,
  onSubmit,
  categoryName,
  setCategoryName,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add Category</DialogTitle>
      <DialogContent>
        <DialogContentText>Enter the category name:</DialogContentText>
        <TextField
          autoFocus
          fullWidth
          variant="standard"
          label="Category Name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='contained' color="error">
          Cancel
        </Button>
        <Button onClick={onSubmit} variant='contained' color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCategoryDialog;
