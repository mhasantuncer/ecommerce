import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './pages/Layout';
import NotFound from './pages/NotFound';
import { Spinner } from './components/Spinner';
import { ProtectedRoute } from './components/ProtectedRoute';

// Lazy-loaded pages
const Home = lazy(() => import('./pages/shop/Home'));
const ProductsPage = lazy(() => import('./pages/shop/products/ProductsPage'));
const ProductDetails = lazy(
  () => import('./pages/shop/products/ProductDetails')
);
const AdminPage = lazy(() => import('./pages/admin/AdminPage'));
const Cart = lazy(() => import('./pages/shop/Cart'));

// 🛠️ Admin Pages
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
        path: 'cart',
        element: (
          <Suspense fallback={<Spinner />}>
            <Cart />
          </Suspense>
        ),
      },

      // 🛠️ Admin Routes
      {
        path: 'admin',
        element: (
          <Suspense fallback={<Spinner />}>
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          </Suspense>
        ),
        children: [
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
        ],
      },
    ],
  },
]);
