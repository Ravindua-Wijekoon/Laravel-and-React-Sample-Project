import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  MenuItem,
  Slider,
} from '@mui/material';
import { Link } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import AddCircleOutline from '@mui/icons-material/AddCircle';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Cropper from 'react-easy-crop';
import apiClient from '../axios';

const NavBar = () => {
  const [openCategory, setOpenCategory] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [openProduct, setOpenProduct] = useState(false);
  const [categories, setCategories] = useState([]);
  const [openCropDialog, setOpenCropDialog] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    apiClient
      .get('/categories')
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  const handleOpenCategory = () => setOpenCategory(true);
  const handleCloseCategory = () => setOpenCategory(false);

  const handleOpenProduct = () => setOpenProduct(true);
  const handleCloseProduct = () => {
    setOpenProduct(false);
    setPreview(null);
    formik.resetForm();
  };

  const handleCategorySubmit = () => {
    apiClient
      .post('/categories', { name: categoryName })
      .then((response) => {
        setCategories((prev) => [...prev, response.data]);
        setCategoryName('');
        handleCloseCategory();
      })
      .catch((error) => {
        console.error('Error creating category:', error);
      });
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const createCroppedImage = async () => {
    const canvas = document.createElement('canvas');
    const image = await new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = imageSrc;
    });
    const ctx = canvas.getContext('2d');
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;
    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg');
    });
  };

  const handleCropSubmit = async () => {
    const croppedImageBlob = await createCroppedImage();
    setCroppedImage(croppedImageBlob);
    setOpenCropDialog(false);
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      price: '',
      description: '',
      quantity: '',
      categoryId: '',
      photo: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Product name is required'),
      price: Yup.number().required('Price is required').positive('Price must be positive'),
      description: Yup.string(),
      quantity: Yup.number().required('Quantity is required').min(1, 'Quantity must be at least 1'),
      categoryId: Yup.string().required('Category is required'),
      photo: Yup.mixed().required('Photo is required'),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('price', values.price);
      formData.append('description', values.description);
      formData.append('quantity', values.quantity);
      formData.append('category_id', values.categoryId);
      formData.append('photo', croppedImage);

      apiClient
        .post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((response) => {
          console.log('Product created successfully:', response.data);
          handleCloseProduct();
        })
        .catch((error) => {
          console.error('Error creating product:', error);
        });
    },
  });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setPreview(reader.result);
      setOpenCropDialog(true);

    };
    reader.readAsDataURL(file);
  };

  return (
    <AppBar position="static" color="white" sx={{ boxShadow: 'none', borderBottom: '1px solid #ccc' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            BuyNest
          </Link>
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" onClick={handleOpenCategory}>
            <AddCircleOutline fontSize="small" sx={{ marginRight: 1 }} />
            Add Category
          </Button>
          <Button color="inherit" onClick={handleOpenProduct}>
            <AddCircleOutline fontSize="small" sx={{ marginRight: 1 }} />
            Add Product
          </Button>
        </Box>
      </Toolbar>

      {/* Add Category Dialog */}
      <Dialog open={openCategory} onClose={handleCloseCategory}>
        <DialogTitle>Add Category</DialogTitle>
        <DialogContent>
          <DialogContentText>Please enter the name of the new category.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            type="text"
            fullWidth
            variant="standard"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCategory} color="error">
            Cancel
          </Button>
          <Button onClick={handleCategorySubmit} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* add product popup */}
      <Dialog open={openProduct} onClose={handleCloseProduct}>
        <DialogTitle>Add Product</DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit} encType="multipart/form-data">

            {preview && (
              <Box sx={{ mb: 2, textAlign: 'center' }}>
                <img
                  src={preview}
                  alt="Preview"
                  style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }}
                />
              </Box>
            )}
            <Button variant="contained" component="label">
              Upload Photo
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  formik.setFieldValue('photo', e.target.files[0]);
                  handleFileChange(e);
                }}
              />
            </Button>
            <TextField
              fullWidth
              label="Product Name"
              name="name"
              variant="standard"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              variant="standard"
              value={formik.values.price}
              onChange={formik.handleChange}
              error={formik.touched.price && Boolean(formik.errors.price)}
              helperText={formik.touched.price && formik.errors.price}
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              variant="standard"
              multiline
              rows={3}
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />
            <TextField
              fullWidth
              label="Quantity"
              name="quantity"
              type="number"
              variant="standard"
              value={formik.values.quantity}
              onChange={formik.handleChange}
              error={formik.touched.quantity && Boolean(formik.errors.quantity)}
              helperText={formik.touched.quantity && formik.errors.quantity}
            />
            <TextField
              fullWidth
              label="Category"
              name="categoryId"
              variant="standard"
              select
              value={formik.values.categoryId}
              onChange={formik.handleChange}
              error={formik.touched.categoryId && Boolean(formik.errors.categoryId)}
              helperText={formik.touched.categoryId && formik.errors.categoryId}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
            <DialogActions>
              <Button onClick={handleCloseProduct} color="error">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Add
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* crop image popup */}
      <Dialog 
        open={openCropDialog} 
        fullWidth 
        maxWidth="md" 
        onClose={() => setOpenCropDialog(false)}
      >
        <DialogTitle>Crop Image</DialogTitle>
        <DialogContent>
          <div
            style={{
              position: 'relative',
              width: '100%', 
              height: '400px',
              background: '#333',
            }}
          >
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(e, value) => setZoom(value)}
          />
        </DialogContent>
        <DialogActions sx={{ padding: 2, paddingRight:3 }} >
          <Button variant='contained' onClick={() => setOpenCropDialog(false)} color="error">
            Cancel
          </Button>
          <Button variant='contained' onClick={handleCropSubmit} color="primary">
            Crop & Save
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default NavBar;
