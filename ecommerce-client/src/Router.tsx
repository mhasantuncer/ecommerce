import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from './pages/Layout';
import NotFound from './pages/NotFound';
import { Spinner } from './components/Spinner';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthLayout } from './pages/auth/AuthLayout';
import Login from './pages/auth/Login';
import CheckoutPage from './pages/shop/CheckoutPage';
import OrderConfirmation from './pages/shop/OrderConfirmation';

// Lazy-loaded pages
const Home = lazy(() => import('./pages/shop/Home'));
const ProductsPage = lazy(() => import('./pages/shop/products/ProductsPage'));
const ProductDetails = lazy(
  () => import('./pages/shop/products/ProductDetails')
);
const Cart = lazy(() => import('./pages/shop/Cart'));

// Admin Components
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ManageProducts = lazy(
  () => import('./pages/admin/products/ManageProducts')
);
const CreateProduct = lazy(
  () => import('./pages/admin/products/CreateProduct')
);
const UpdateProduct = lazy(
  () => import('./pages/admin/products/UpdateProduct')
);
const ManageCustomers = lazy(
  () => import('./pages/admin/customers/ManageCustomers')
);
const CreateCustomer = lazy(
  () => import('./pages/admin/customers/CreateCustomer')
);
const UpdateCustomer = lazy(
  () => import('./pages/admin/customers/UpdateCustomer')
);
const ManageOrders = lazy(() => import('./pages/admin/orders/ManageOrders'));
const OrderDetails = lazy(() => import('./pages/admin/orders/OrderDetails'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Spinner />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: 'shop/products',
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<Spinner />}>
                <ProductsPage />
              </Suspense>
            ),
          },
          {
            path: ':id',
            element: (
              <Suspense fallback={<Spinner />}>
                <ProductDetails />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: 'order-confirmation',
        element: (
          <Suspense fallback={<Spinner />}>
            <OrderConfirmation />
          </Suspense>
        ),
      },
      {
        path: 'checkout',
        element: (
          <Suspense fallback={<Spinner />}>
            <CheckoutPage />
          </Suspense>
        ),
      },
      {
        path: 'cart',
        element: (
          <Suspense fallback={<Spinner />}>
            <Cart />
          </Suspense>
        ),
      },
      {
        path: 'auth',
        element: <AuthLayout />,
        children: [
          {
            path: 'login',
            element: (
              <Suspense fallback={<Spinner />}>
                <Login />
              </Suspense>
            ),
          },
        ],
      },

      {
        path: 'admin',
        element: (
          <Suspense fallback={<Spinner />}>
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<Spinner />}>
                <AdminDashboard />
              </Suspense>
            ),
          },
          {
            path: 'products',
            children: [
              {
                index: true,
                element: (
                  <Suspense fallback={<Spinner />}>
                    <ManageProducts />
                  </Suspense>
                ),
              },
              {
                path: 'create',
                element: (
                  <Suspense fallback={<Spinner />}>
                    <CreateProduct />
                  </Suspense>
                ),
              },
              {
                path: 'update/:id',
                element: (
                  <Suspense fallback={<Spinner />}>
                    <UpdateProduct />
                  </Suspense>
                ),
              },
            ],
          },
          {
            path: 'customers',
            children: [
              {
                index: true,
                element: (
                  <Suspense fallback={<Spinner />}>
                    <ManageCustomers />
                  </Suspense>
                ),
              },
              {
                path: 'create',
                element: (
                  <Suspense fallback={<Spinner />}>
                    <CreateCustomer />
                  </Suspense>
                ),
              },
              {
                path: 'update/:id',
                element: (
                  <Suspense fallback={<Spinner />}>
                    <UpdateCustomer />
                  </Suspense>
                ),
              },
            ],
          },
          {
            path: 'orders',
            children: [
              {
                index: true,
                element: (
                  <Suspense fallback={<Spinner />}>
                    <ManageOrders />
                  </Suspense>
                ),
              },
              {
                path: ':id',
                element: (
                  <Suspense fallback={<Spinner />}>
                    <OrderDetails />
                  </Suspense>
                ),
              },
            ],
          },
          // Redirect invalid admin paths to dashboard
          {
            path: '*',
            element: <Navigate to="/admin" replace />,
          },
        ],
      },
      // Global 404 catch
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
