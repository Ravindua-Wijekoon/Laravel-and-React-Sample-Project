import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const UpdateProductDialog = ({ open, onClose, onSubmit, product, categories }) => {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Product name is required'),
    price: Yup.number().required('Price is required').positive(),
    quantity: Yup.number().required('Quantity is required').integer().positive(),
    category_id: Yup.string().required('Category is required'),
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Update Product</DialogTitle>
      <Formik
        initialValues={{
          name: product?.name || '',
          price: product?.price || '',
          quantity: product?.quantity || '',
          description: product?.description || '',
          category_id: product?.category_id || '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSubmit(values);
          onClose();
        }}
        enableReinitialize
      >
        {({ errors, touched, setFieldValue }) => (
          <Form>
            <DialogContent>
              <Field
                name="name"
                as={TextField}
                label="Product Name"
                variant="standard"
                fullWidth
                margin="normal"
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
              />
              <Field
                name="price"
                as={TextField}
                label="Price"
                fullWidth
                margin="normal"
                variant="standard"
                type="number"
                error={touched.price && Boolean(errors.price)}
                helperText={touched.price && errors.price}
              />
              <Field
                name="quantity"
                as={TextField}
                label="Quantity"
                fullWidth
                margin="normal"
                variant="standard"
                type="number"
                error={touched.quantity && Boolean(errors.quantity)}
                helperText={touched.quantity && errors.quantity}
              />
              <Field
                name="description"
                as={TextField}
                label="Description"
                fullWidth
                margin="normal"
                variant="standard"
                multiline
                rows={3}
              />
              <Field
                name="category_id"
                as={TextField}
                label="Category"
                fullWidth
                margin="normal"
                variant="standard"
                select
                error={touched.category_id && Boolean(errors.category_id)}
                helperText={touched.category_id && errors.category_id}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Field>
            </DialogContent>
            <DialogActions >
              <Button onClick={onClose} variant='contained' color="error">
                Cancel
              </Button>
              <Button type="submit" variant='contained' color="primary">
                Update
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default UpdateProductDialog;
