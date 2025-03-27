import { NavLink, Outlet } from 'react-router-dom';
import '../styles/layout.scss';

export const Layout = () => {
  return (
    <div className="layout">
      <header className="header">
        <nav className="nav">
          <div className="nav-brand">E-Commerce Shop</div>
          <ul className="nav-list">
            <li className="nav-item">
              <NavLink
                to={'/'}
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to={'/shop/products'}
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                Shop
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to={'/admin'}
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                Admin Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to={'/cart'}
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                Cart
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <p>
          © {new Date().getFullYear()} E-Commerce Shop. All rights reserved.
        </p>
      </footer>
    </div>
  );
};
