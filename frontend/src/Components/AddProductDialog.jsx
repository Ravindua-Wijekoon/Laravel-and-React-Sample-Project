import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  MenuItem,
  Typography,
  Box,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Cropper from 'react-easy-crop';
import { getCroppedImage } from '../utils/cropImage';
import apiClient from '../axios';
import Swal from 'sweetalert2';

const AddProductDialog = ({ open, onClose, categories, onProductAdded }) => {
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required('Product name is required'),
    price: Yup.number().required('Price is required').positive('Price must be positive'),
    description: Yup.string().optional(),
    quantity: Yup.number()
      .required('Quantity is required')
      .positive('Quantity must be greater than zero')
      .integer('Quantity must be an integer'),
    category_id: Yup.number().required('Category is required'),
    photo: Yup.mixed().required('Product image is required'),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: '',
      price: '',
      description: '',
      quantity: '',
      category_id: '',
      photo: null,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          formData.append(key, value);
        });
  
        const response = await apiClient.post('/products', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        // Success Alert
        Swal.fire({
          icon: 'success',
          title: 'Product Added!',
          text: 'The product has been successfully added.',
          confirmButtonText: 'OK',
        });
  
        onProductAdded(response.data);
        resetForm();
        onClose();
        setUploadedImage(null);
        setPreviewUrl(null); 
      } catch (error) {
        console.error('Error adding product:', error);
  
        // Error Alert
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'An error occurred while adding the product. Please try again.',
          confirmButtonText: 'OK',
        });
      }
    },
  });
  
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result);
        setCropDialogOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async () => {
    const croppedImageBlob = await getCroppedImage(uploadedImage, croppedAreaPixels);
    formik.setFieldValue('photo', croppedImageBlob); 
    setPreviewUrl(URL.createObjectURL(croppedImageBlob)); 
    setCropDialogOpen(false); 
  };

  const handleCloseDialog = () => {
    formik.resetForm(); 
    setUploadedImage(null); 
    setPreviewUrl(null); 
    onClose(); 
  };

  return (
    <>
      <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>Add Product</DialogTitle>
          <DialogContent>
            
            {/* Image Preview */}
            {previewUrl && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <img
                  src={previewUrl}
                  alt="Cropped Preview"
                  style={{ maxWidth: '40%', height: 'auto', marginTop: 10 }}
                />
              </Box>
            )}

            <Button
              variant="contained"
              component="label"
              sx={{ my: 3 }}
            >
              Upload Photo
              <input
                type="file"
                hidden
                name="photo"
                onChange={handleImageUpload}
              />
            </Button>
            {formik.touched.photo && formik.errors.photo && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {formik.errors.photo}
              </Typography>
            )}

            <TextField
              margin="dense"
              label="Product Name"
              fullWidth
              variant="standard"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
              margin="dense"
              label="Price"
              fullWidth
              variant="standard"
              name="price"
              type="number"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.price && Boolean(formik.errors.price)}
              helperText={formik.touched.price && formik.errors.price}
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={3}
              variant="standard"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <TextField
              margin="dense"
              label="Quantity"
              fullWidth
              variant="standard"
              name="quantity"
              type="number"
              value={formik.values.quantity}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.quantity && Boolean(formik.errors.quantity)}
              helperText={formik.touched.quantity && formik.errors.quantity}
            />
            <TextField
              margin="dense"
              label="Category"
              select
              fullWidth
              variant="standard"
              name="category_id"
              value={formik.values.category_id}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.category_id && Boolean(formik.errors.category_id)}
              helperText={formik.touched.category_id && formik.errors.category_id}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} variant='contained' color="error">
              Cancel
            </Button>
            <Button type="submit" variant='contained' color="primary">
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Cropper Dialog */}
      <Dialog open={cropDialogOpen} onClose={() => setCropDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Crop Image</DialogTitle>
        <DialogContent>
          <Box sx={{ position: 'relative', width: '100%', height: 400, background: '#333' }}>
            <Cropper
              image={uploadedImage}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCropDialogOpen(false)} variant='contained' color="error">
            Cancel
          </Button>
          <Button onClick={handleCropComplete} variant='contained' color="primary">
            Crop & Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddProductDialog;
