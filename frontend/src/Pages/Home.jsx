import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import apiClient from '../axios'
import {
    Button,
    Container,
    Typography,
    CardActions,
    CardContent,
    CardMedia,
    Grid,
    Card,
  } from '@mui/material';
  

function Home() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        apiClient.get('/products').then((response) => {
            setProducts(response.data);
            console.log('Products fetched successfully');
        })
        .catch((error) => {
            console.error('Error fetching products', error);
        })
    },[]);

  return (
    <Container>
        <Typography     >
            Available Products
        </Typography>
        

        {/* Products Grid */}
        <Grid container spacing={4}>
            {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card>
                {/* Product Image */}
                <CardMedia
                    component="img"
                    height="200"
                    image={product.photo || 'https://via.placeholder.com/200'} // Placeholder if no image
                    alt={product.name}
                />

                {/* Product Content */}
                <CardContent>
                    <Typography variant="h6" component="div">
                    {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                    {product.description}
                    </Typography>
                    <Typography variant="subtitle1" color="primary" sx={{ marginTop: 1 }}>
                    ${product.price}
                    </Typography>
                    <Typography variant="caption" display="block">
                    Quantity: {product.quantity}
                    </Typography>
                </CardContent>

                {/* Card Actions */}
                <CardActions>
                    <Button size="small" onClick={() => navigate(`/edit-product/${product.id}`)}>
                    Edit
                    </Button>
                    <Button size="small" color="error" onClick={() => console.log('Delete product')}>
                    Delete
                    </Button>
                </CardActions>
                </Card>
            </Grid>
            ))}
        </Grid>
    </Container>
    
  )
}

export default Home