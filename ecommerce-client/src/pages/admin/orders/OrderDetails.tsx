import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { IOrder } from '../../../models/IOrder';
import axios from 'axios';
import './OrderDetails.scss';
import { Spinner } from '../../../components/Spinner';
import { FiArrowLeft } from 'react-icons/fi';

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<IOrder['order_status']>('pending');

  useEffect(() => {
    if (!isAuthenticated || !id) return;

    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/orders/${id}`);
        setOrder(response.data);
        setStatus(response.data.order_status);
      } catch (err) {
        setError('Failed to fetch order details');
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [isAuthenticated, id]);

  const handleStatusUpdate = async () => {
    if (!order || !status) return;

    try {
      await axios.patch(`http://localhost:3000/orders/${order.id}`, {
        order_status: status,
      });
      setOrder({ ...order, order_status: status });
    } catch (err) {
      setError('Failed to update order status');
      console.error('Error updating order:', err);
    }
  };

  if (!isAuthenticated) {
    return <div className="auth-warning">Please login to access this page</div>;
  }

  if (loading) {
    return <Spinner />;
  }

  if (!order) {
    return <div className="not-found">Order not found</div>;
  }

  return (
    <div className="order-details-container">
      <div className="header-section">
        <Link to="/admin/orders" className="back-button">
          <FiArrowLeft className="icon" /> Back to Orders
        </Link>
        <h1 className="page-title">Order #{order.id}</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="order-summary">
        <div className="summary-card">
          <h3>Customer Information</h3>
          <p>
            <strong>Name:</strong> {order.customer_firstname || 'N/A'}{' '}
            {order.customer_lastname || ''}
          </p>
          <p>
            <strong>Email:</strong> {order.customer_email || 'N/A'}
          </p>
          <p>
            <strong>Phone:</strong> {order.customer_phone || 'N/A'}
          </p>
          <p>
            <strong>Address:</strong>{' '}
            {[
              order.customer_street_address,
              order.customer_postal_code,
              order.customer_city,
              order.customer_country,
            ]
              .filter(Boolean)
              .join(', ') || 'N/A'}
          </p>
        </div>

        <div className="summary-card">
          <h3>Order Information</h3>
          <p>
            <strong>Date:</strong> {new Date(order.created_at).toLocaleString()}
          </p>
          <p>
            <strong>Total:</strong> ${order.total_price.toFixed(2)}
          </p>
          <p>
            <strong>Payment Status:</strong> {order.payment_status}
          </p>

          <div className="status-control">
            <label>
              <strong>Order Status:</strong>
            </label>
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as IOrder['order_status'])
              }
              className="status-select"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button onClick={handleStatusUpdate} className="update-button">
              Update Status
            </button>
          </div>
        </div>
      </div>

      <div className="order-items-section">
        <h2>Order Items</h2>
        <table className="items-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.order_items.map((item) => (
              <tr key={item.id}>
                <td>
                  <Link
                    to={`/shop/products/${item.product_id}`}
                    className="product-link"
                  >
                    {item.product_name}
                  </Link>
                </td>
                <td>${item.unit_price.toFixed(2)}</td>
                <td>{item.quantity}</td>
                <td>${(item.unit_price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="total-label">
                Total
              </td>
              <td className="total-amount">${order.total_price.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default OrderDetails;
