import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

const AdminPage = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
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
      <Outlet />
    </div>
  );
};

export default AdminPage;
