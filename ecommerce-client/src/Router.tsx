import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './pages/Layout';
import NotFound from './pages/NotFound';
import { Spinner } from './components/Spinner';
import { ProtectedRoute } from './components/ProtectedRoute';

// Lazy-loaded pages
const Home = lazy(() => import('./pages/Home'));
const ProductsPage = lazy(() => import('./pages/products/ProductsPage'));
const ProductDetails = lazy(() => import('./pages/products/ProductDetails'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const Cart = lazy(() => import('./pages/Cart'));

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
        path: 'products',
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
        path: 'admin',
        element: (
          <Suspense fallback={<Spinner />}>
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
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
    ],
  },
]);
