// src/pages/admin/AdminPage.tsx
import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminPage = () => {
  const { logout } = useAuth();

  return (
    <div>
      <header>
        <h1>Admin Dashboard</h1>
        <button onClick={logout}>Logout</button>
      </header>
      <nav>
        <ul>
          <li>
            <Link to="/admin/customers">Manage Customers</Link>
          </li>
          <li>
            <Link to="/admin/products">Manage Products</Link>
          </li>
          <li>
            <Link to="/admin/orders">Manage Orders</Link>
          </li>
        </ul>
      </nav>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPage;
