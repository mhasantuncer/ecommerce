import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { IOrder } from '../../../models/IOrder';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ManageOrders.scss';
import { FiSearch, FiRefreshCw } from 'react-icons/fi';
import { Spinner } from '../../../components/Spinner';

const ITEMS_PER_PAGE = 10;

const ManageOrders = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3000/orders');
        setOrders(response.data);
        setFilteredOrders(response.data);
        setTotalPages(Math.ceil(response.data.length / ITEMS_PER_PAGE));
      } catch (err) {
        setError('Failed to fetch orders');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  const handleStatusUpdate = async (
    id: number,
    newStatus: IOrder['order_status']
  ) => {
    try {
      await axios.patch(`http://localhost:3000/orders/${id}`, {
        order_status: newStatus,
      });

      setOrders(
        orders.map((order) =>
          order.id === id ? { ...order, order_status: newStatus } : order
        )
      );
      applyFilters();
    } catch (err) {
      setError('Failed to update order status');
      console.error('Error updating order:', err);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = orders;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(
        (order) => order.order_status === statusFilter
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.id.toString().includes(term) ||
          order.customer_id.toString().includes(term) ||
          order.order_items.some((item) =>
            item.product_name.toLowerCase().includes(term)
          )
      );
    }

    setFilteredOrders(filtered);
    setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
    setCurrentPage(1);
  }, [orders, statusFilter, searchTerm]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const refreshOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/orders');
      setOrders(response.data);
      setFilteredOrders(response.data);
    } catch (err) {
      setError('Failed to refresh orders');
      console.error('Error refreshing orders:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <div className="auth-warning">Please login to access this page</div>;
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="manage-orders-container">
      <div className="admin-header">
        <h1 className="page-title">Manage Orders</h1>
        <button onClick={refreshOrders} className="refresh-button">
          <FiRefreshCw className="icon" /> Refresh
        </button>
      </div>

      <div className="controls-container">
        <div className="filters-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <FiSearch className="search-icon" />
          </div>

          <div className="status-filter">
            <label>Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <div className="table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer ID</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.customer_id}</td>
                    <td>{order.order_items.length} item(s)</td>
                    <td>${order.total_price.toFixed(2)}</td>
                    <td>
                      <select
                        value={order.order_status}
                        onChange={(e) =>
                          handleStatusUpdate(
                            order.id,
                            e.target.value as IOrder['order_status']
                          )
                        }
                        className="status-select"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="actions-cell">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="view-button"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination-container">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                Previous
              </button>
              <span className="page-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManageOrders;
