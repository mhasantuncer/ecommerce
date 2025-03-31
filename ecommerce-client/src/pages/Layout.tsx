import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import '../styles/layout.scss';

export const Layout = () => {
  return (
    <div className="layout">
      <Header />
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
