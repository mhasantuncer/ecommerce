# 🛍️ Modern E-Commerce Platform

A full-stack e-commerce application with React, TypeScript, and Vite, featuring admin dashboard, product management, and secure checkout.


## ✨ Features

### 🛒 Customer Facing
- Product catalog with categories/filters
- Shopping cart with persistent storage
- Checkout flow with Stripe integration
- Order confirmation

### 🔐 Authentication
- JWT-based login
- Protected routes

### 🛠️ Admin Dashboard
- CRUD operations for products
- Customer management
- Order fulfillment system

## 🛠 Tech Stack

**Frontend**  
- React 18 + TypeScript  
- Vite (Build Tool)  
- React Router 
- Context API (State Management)  
- SCSS Modules (Styling)  
- React Hook Form (Forms)  
- Lazy Loading + Code Splitting  

**Backend** *(Assuming you have one)*  
- Node.js/Express
- JWT Authentication  
- MySql  

## 📂 Project Structure

```bash
###Frontend
  App.css
│   App.tsx
│   index.css
│   main.tsx
│   Router.tsx
│   vite-env.d.ts
│
├───assets
│       3d-delivery-robot-working.jpg
│
├───components
│   │   CartDropdown.tsx
│   │   Header.tsx
│   │   ProductCard.tsx
│   │   ProtectedRoute.tsx
│   │   Spinner.scss
│   │   Spinner.tsx
│   │
│   └───checkout
│           CartSummary.scss
│           CartSummary.tsx
│           CustomerForm.scss
│           CustomerForm.tsx
│
├───context
│       AuthContext.tsx
│       CartContext.tsx
│
├───hooks
│       useCart.ts
│       useProduct.ts
│
├───models
│       IAuth.ts
│       ICustomer.ts
│       IOrder.ts
│       IProduct.ts
│
├───pages
│   │   Layout.tsx
│   │   NotFound.tsx
│   │
│   ├───admin
│   │   │   AdminDashboard.scss
│   │   │   AdminDashboard.tsx
│   │   │   AdminLayout.scss
│   │   │   AdminLayout.tsx
│   │   │
│   │   ├───customers
│   │   │       CreateCustomer.scss
│   │   │       CreateCustomer.tsx
│   │   │       ManageCustomers.scss
│   │   │       ManageCustomers.tsx
│   │   │       UpdateCustomer.scss
│   │   │       UpdateCustomer.tsx
│   │   │
│   │   ├───orders
│   │   │       ManageOrders.scss
│   │   │       ManageOrders.tsx
│   │   │       OrderDetails.scss
│   │   │       OrderDetails.tsx
│   │   │
│   │   └───products
│   │           CreateProduct.scss
│   │           CreateProduct.tsx
│   │           ManageProducts.scss
│   │           ManageProducts.tsx
│   │           UpdateProduct.scss
│   │           UpdateProduct.tsx
│   │
│   ├───auth
│   │       AuthLayout.scss
│   │       AuthLayout.tsx
│   │       Login.scss
│   │       Login.tsx
│   │
│   └───shop
│       │   Cart.tsx
│       │   CheckoutPage.scss
│       │   CheckoutPage.tsx
│       │   Home.tsx
│       │   OrderConfirmation.scss
│       │   OrderConfirmation.tsx
│       │
│       └───products
│               ProductDetails.tsx
│               ProductsPage.tsx
│
├───services
│       adminService.ts
│       baseService.ts
│       customerService.ts
│       orderService.ts
│       productService.ts
│       stripeService.ts
│
└───styles
    │   cartdropdown.scss
    │   cartpage.scss
    │   header.scss
    │   layout.scss
    │   productdetails.scss
    │   productspage.scss
    │
    ├───base
    │       _mixins.scss
    │       _variables.scss
    │
    └───core
            home.scss

###Backend

 index.ts
│
├───config
│       db.ts
│
├───controllers
│       authController.ts
│       customerController.ts
│       orderController.ts
│       orderItemController.ts
│       productController.ts
│
├───middleware
│       auth.ts
│
├───models
│       ICustomer.ts
│       IOrder.ts
│       IOrderItem.ts
│       IProduct.ts
│       IUser.ts
│
├───routes
│       auth.ts
│       customers.ts
│       orderItems.ts
│       orders.ts
│       products.ts
│
└───utilities
        logger.ts
