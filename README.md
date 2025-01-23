# CRUD Application with Laravel and React

## Overview
This project is a CRUD (Create, Read, Update, Delete) application built with **Laravel** for the backend and **React** for the frontend. The app demonstrates a simple product management system, including categories and products, with support for file uploads (product images).

---

## Features
- **Create**:
  - Add new products and categories.
  - Upload product images.
- **Read**:
  - View a list of products along with their associated categories.
  - Display product images.
- **Update**:
  - Edit existing product details and upload new images.
- **Delete**:
  - Remove products from the database with confirmation prompts.

---

## Technologies Used

### Backend
- **Framework**: Laravel
- **Database**: MySQL
- **API Design**: RESTful API with `apiResource`

### Frontend
- **Framework**: React
- **UI Library**: Material-UI (MUI)
- **State Management**: React State
- **Validation**: Formik and Yup

### Other Tools
- **HTTP Client**: Axios
- **SweetAlert**: Confirmation dialogs

---

## Usage

### Adding a Product
1. Click the **Add Product** button.
2. Fill in the product details.
3. Upload an image (optional).
4. Submit the form to save the product.

### Updating a Product
1. Click the **Edit** icon next to a product.
2. Modify the fields as needed.
3. Submit the form to save changes.

### Deleting a Product
1. Click the **Delete** icon next to a product.
2. Confirm the deletion in the popup dialog.

---

## API Endpoints

### Product Routes
| Method | Endpoint            | Description              |
|--------|---------------------|--------------------------|
| GET    | `/api/products`     | Get all products         |
| POST   | `/api/products`     | Create a new product     |
| PUT    | `/api/products/{id}`| Update an existing product |
| DELETE | `/api/products/{id}`| Delete a product         |

### Category Routes
| Method | Endpoint              | Description                |
|--------|-----------------------|----------------------------|
| GET    | `/api/categories`     | Get all categories         |
| POST   | `/api/categories`     | Create a new category      |

---

## Screenshots

![image](https://github.com/user-attachments/assets/2f00262f-b395-4746-b0b4-9ea9f4ca7442)
![image](https://github.com/user-attachments/assets/294ea7f8-823c-4228-a1e6-d33b7ccd73f4)
![image](https://github.com/user-attachments/assets/16bd27de-e82c-4fde-bacd-2b489a8442c2)
![image](https://github.com/user-attachments/assets/ceb127c7-751b-4173-8802-e3c91bc6e5ee)
![image](https://github.com/user-attachments/assets/24e10043-46c1-4298-b1ca-d3bf7f9359d2)






