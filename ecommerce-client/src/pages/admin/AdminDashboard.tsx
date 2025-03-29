import { Link } from 'react-router-dom';
import './AdminDashboard.scss';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="dashboard-grid">
        <Link to="/admin/products" className="dashboard-card">
          <h2>Products</h2>
          <p>Manage your product catalog</p>
        </Link>
        <Link to="/admin/customers" className="dashboard-card">
          <h2>Customers</h2>
          <p>View and manage customers</p>
        </Link>
        <Link to="/admin/orders" className="dashboard-card">
          <h2>Orders</h2>
          <p>Process and track orders</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
