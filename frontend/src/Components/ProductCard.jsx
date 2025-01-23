import { CardMedia, Dialog, DialogContent, Grid } from '@mui/material'
import React from 'react'

const ProductCard = ({open, onClose, product}) => {

    console.log(product)
  if (!product) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={'md'}>
        <DialogContent>
        <Grid container spacing={2} alignItems="center">
            {/* Image Section */}
            <Grid item md={6} xs={12}>
                <CardMedia
                    component="img"
                    alt={product.name}
                    image={product.photo}
                    style={{ width: '400px', minWidth:'300px', borderRadius:5 }}
                />
            </Grid>

            {/* Details Section */}
            <Grid item md={6} xs={12} maxWidth={'500px'}>
                <Grid
                    container
                    direction="column"
                    spacing={2}
                    justifyContent="flex-start"
                >
                    <Grid item mb={-2}>
                        <span
                            style={{
                            backgroundColor: '#1565c0',
                            borderRadius: '2px',
                            padding: '2px 10px',
                            fontSize: '12px',
                            color: 'white',
                            }}
                        >
                            {product.category.name}
                        </span>
                    </Grid>
                    <Grid item style={{ fontSize: '30px', fontWeight: 'bold' }}>
                        {product.name}
                    </Grid>
                    <Grid item mt={3} mb={3} style={{ fontSize: '16px', color: '#777' }}>
                        {product.description}
                    </Grid>
                    <Grid item mb={-2} textAlign={'right'}  style={{ fontSize: '16px', color: '#777' }}>
                        Available: {product.quantity}
                    </Grid>
                    <Grid item textAlign={'right'} style={{ fontSize: '25px', fontWeight: 'bold', color: '#333' }}>
                        LKR. {product.price}
                    </Grid>
                    
                </Grid>
            </Grid>
            </Grid>
        </DialogContent>
    </Dialog>
  )
}

export default ProductCard