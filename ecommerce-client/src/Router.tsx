import { createBrowserRouter } from 'react-router-dom';
import { AdminPage } from './pages/AdminPage';
import { Cart } from './pages/Cart';
import { Home } from './pages/Home';
import { Layout } from './pages/Layout';
import { NotFound } from './pages/NotFound';
import { ProductsPage } from './pages/products/ProductsPage';
import { ProductDetails } from './pages/products/ProductDetails';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/products/',
        element: <ProductsPage />,
      },
      {
        path: '/products/:id',
        element: <ProductDetails />,
      },
      {
        path: '/admin',
        element: <AdminPage />,
      },
      {
        path: '/cart',
        element: <Cart />,
      },
    ],
  },
]);
