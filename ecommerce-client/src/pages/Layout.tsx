import { NavLink, Outlet } from 'react-router-dom';
import '../styles/layout.scss';

export const Layout = () => {
  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <NavLink to={'/'}>Home</NavLink>
            </li>
            <li>
              <NavLink to={'/products'}>Products</NavLink>
            </li>
            <li>
              <NavLink to={'/admin'}>Admin</NavLink>
            </li>
            <li>
              <NavLink to={'/cart'}>Cart</NavLink>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>This is the footer</footer>
    </>
  );
};
