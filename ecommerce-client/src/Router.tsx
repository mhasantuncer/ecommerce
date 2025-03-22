import { createBrowserRouter } from 'react-router-dom';
import { Admin } from './pages/Admin';
import { Cart } from './pages/Cart';
import { Home } from './pages/Home';
import { Layout } from './pages/Layout';
import { NotFound } from './pages/NotFound';
import { Products } from './pages/Products';

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
        path: '/products',
        element: <Products />,
      },
      {
        path: '/admin',
        element: <Admin />,
      },
      {
        path: '/cart',
        element: <Cart />,
      },
    ],
  },
]);
