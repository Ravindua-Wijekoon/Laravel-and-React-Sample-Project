import React, { useEffect, useState } from 'react';
import {
  Typography,
  Button,
  Box,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CardMedia,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutline from '@mui/icons-material/AddCircle';
import apiClient from '../axios';
import AddCategoryDialog from '../Components/AddCategoryDialog';
import AddProductDialog from '../Components/AddProductDialog';
import Swal from 'sweetalert2';
import UpdateProductDialog from '../Components/UpdateProductDialog';
import ProductCard from '../Components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openCategory, setOpenCategory] = useState(false);
  const [openProduct, setOpenProduct] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openProductCard, setOpenProductCard] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = () => {
    apiClient.get('/categories').then((response) => {
      setCategories(response.data);
    });
  };

  const fetchProducts = () => {
    apiClient
      .get('/products')
      .then((response) => {
        setProducts(response.data); 
      })
      .catch((error) => console.error('Error fetching products', error));
  };


  const handleOpenCategory = () => setOpenCategory(true);
  const handleCloseCategory = () => setOpenCategory(false);


  const handleCategorySubmit = () => {
    apiClient
      .post('/categories', { name: categoryName })
      .then((response) => {
        setCategories((prev) => [...prev, response.data]);
        setCategoryName('');
        handleCloseCategory();
  

        Swal.fire({
          icon: 'success',
          title: 'Category Added!',
          text: 'The category has been successfully added.',
          confirmButtonText: 'OK',
        });
      })
      .catch((error) => {
        console.error('Error creating category', error);
  
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: 'An error occurred while adding the category. Please try again.',
          confirmButtonText: 'OK', 
        });
      });
  };
  
  // Add product logic
  const handleOpenProduct = () => setOpenProduct(true);
  const handleCloseProduct = () => setOpenProduct(false);

  const handleProductAdded = () => {
    fetchProducts(); 
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action will permanently delete the product.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        apiClient
          .delete(`/products/${id}`)
          .then(() => {
            setProducts((prev) => prev.filter((product) => product.id !== id));
            Swal.fire('Deleted!', 'The product has been deleted.', 'success');
          })
          .catch((error) => {
            console.error('Error deleting product', error);
            Swal.fire('Error!', 'An error occurred while deleting the product.', 'error');
          });
      }
    });
  };

  const handleOpenUpdateDialog = (product) => {
    setSelectedProduct(product);
    setOpenUpdateDialog(true);
  };
  
  const handleCloseUpdateDialog = () => {
    setSelectedProduct(null);
    setOpenUpdateDialog(false);
  };

  const handleOpenProductCard = (id) => {
    setOpenProductCard(true);
    setSelectedProduct(id);
  };

  const handleCloseProductCard = () => {
    setOpenProductCard(false);
    setSelectedProduct(null);
  };
  
  const handleUpdateSubmit = (updatedProduct) => {
    apiClient
      .put(`/products/${selectedProduct.id}`, updatedProduct)
      .then((response) => {
        setProducts((prev) =>
          prev.map((product) =>
            product.id === selectedProduct.id ? response.data : product
          )
        );
        Swal.fire('Updated!', 'The product has been updated.', 'success');
      })
      .catch((error) => {
        console.error('Error updating product', error);
        Swal.fire('Error!', 'An error occurred while updating the product.', 'error');
      });
  };

  return (
    <div style={{backgroundColor:'white', minHeight:'100vh', paddingTop:'20px'}} >
      {/* Header */}
      <Box
        position="static"
        p={2}
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant='contained' color="primary" onClick={handleOpenCategory}>
            <AddCircleOutline fontSize="small" sx={{ marginRight: 1 }} />
            Add Category
          </Button>
          {categories.length > 0 ? (
            <Button variant='contained' color="primary" onClick={handleOpenProduct}>
              <AddCircleOutline fontSize="small" sx={{ marginRight: 1 }} />
              Add Product
            </Button>
          ):(
            
            <Typography></Typography>
          )}
          
        </Box>
      </Box>

      {/* Main Content */}
      <Container >
        <Typography align="center" mt={1} mb={3} variant="h4" sx={{fontWeight: 'bold'}}>
          Available Products
        </Typography>

        <Box px={2} py={3} borderRadius={1} border={'none'} sx={{backgroundColor:'#f4f4f4'}}>
          <TableContainer sx={{mb:3, borderRadius:2, backgroundColor:'white' }} >
            <Table>
              <TableHead >
                  <TableRow>
                    <TableCell sx={{ width:'10%', fontWeight: 'bold'}} >Image</TableCell>
                    <TableCell sx={{ width:'30%', fontWeight: 'bold'}} >Product Name</TableCell>
                    <TableCell sx={{ width:'10%', fontWeight: 'bold'}} >Quantity</TableCell>
                    <TableCell sx={{ width:'20%', fontWeight: 'bold'}} >Category</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }} >Actions</TableCell>
                  </TableRow>
              </TableHead>
            </Table>
          </TableContainer>

          {/* Product Table */}
          <TableContainer component={Paper} border={'none'} sx={{boxShadow:'none'}}>
            <Table>
              <TableBody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <TableRow
                      key={product.id}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: '#f5f5f5' },
                      }}
                      onClick={() => handleOpenProductCard(product)}
                    >
                      <TableCell sx={{ width:'10%'}}>
                        <CardMedia
                          component="img"
                          sx={{ width: 50, height: 50, objectFit: 'cover' }}
                          image={product.photo}
                          alt={product.name}
                        />
                      </TableCell>
                      <TableCell sx={{ width:'30%', fontWeight: 'bold'}}>{product.name}</TableCell>
                      <TableCell sx={{ width:'10%', fontWeight: 'bold'}}>{product.quantity}</TableCell>
                      <TableCell sx={{ width:'20%', fontWeight: 'bold'}}>{product.category?.name || 'No Category'}</TableCell>
                      <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                        <IconButton color="primary" onClick={() => handleOpenUpdateDialog(product)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          sx={{ marginLeft: 1 }}
                          color="error"
                          onClick={() => handleDelete(product.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              ):(
                <TableRow>
                  <TableCell colSpan={5} align='center'  >
                    <Typography my={10} color='Black'>
                      No any products, Please add ...
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Add Category Dialog */}
        <AddCategoryDialog
          open={openCategory}
          onClose={handleCloseCategory}
          onSubmit={handleCategorySubmit}
          categoryName={categoryName}
          setCategoryName={setCategoryName}
        />

        {/* Add Product Dialog */}
        <AddProductDialog
          open={openProduct}
          onClose={handleCloseProduct}
          categories={categories}
          onProductAdded={handleProductAdded}
        />

        <UpdateProductDialog
          open={openUpdateDialog}
          onClose={handleCloseUpdateDialog}
          onSubmit={handleUpdateSubmit}
          product={selectedProduct}
          categories={categories}
        />

        <ProductCard
          open={openProductCard}
          onClose={handleCloseProductCard}
          product={selectedProduct}
        />

      </Container>
    </div>
  );
};

export default Home;
