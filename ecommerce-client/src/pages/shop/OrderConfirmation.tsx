// src/pages/shop/OrderConfirmation.tsx
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getOrderByPaymentId } from '../../services/orderService';
import { IOrder } from '../../models/IOrder';
import { Spinner } from '../../components/Spinner';
import './OrderConfirmation.scss';

const OrderConfirmation = () => {
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const sessionId = params.get('session_id');

        if (!sessionId) {
          throw new Error('Missing session ID');
        }

        const orderData = await getOrderByPaymentId(sessionId);
        setOrder(orderData);

        // Clear storage
        localStorage.removeItem('cart');
        localStorage.removeItem('customerFormData');
      } catch (err) {
        console.error('Failed to fetch order:', err);
        setError(err instanceof Error ? err.message : 'Order lookup failed');
        navigate('/shop/checkout', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [location, navigate]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Order Confirmation Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/shop')}>Return to Shop</button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="error-container">
        <h2>Order Not Found</h2>
        <p>We couldn't retrieve your order details.</p>
        <button onClick={() => navigate('/shop')}>Return to Shop</button>
      </div>
    );
  }

  return (
    <div className="order-confirmation">
      <h1>Order Confirmation</h1>
      <p className="success-message">Thank you for your purchase!</p>

      <section className="order-details">
        <h2>Order #{order.id}</h2>
        <p>Status: {order.order_status}</p>
        <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
        <p>Total: SEK {order.total_price.toFixed(2)}</p>
      </section>

      <section className="customer-details">
        <h2>Customer Information</h2>
        <p>
          {order.customer_firstname} {order.customer_lastname}
        </p>
        <p>{order.customer_email}</p>
        <p>{order.customer_phone}</p>
        <address>
          {order.customer_street_address}
          <br />
          {order.customer_postal_code} {order.customer_city}
          <br />
          {order.customer_country}
        </address>
      </section>

      <section className="order-items">
        <h2>Items</h2>
        <ul>
          {order.order_items.map((item) => (
            <li key={item.id} className="order-item">
              <span className="item-name">{item.product_name}</span>
              <span className="item-quantity">Qty: {item.quantity}</span>
              <span className="item-price">
                SEK {(item.unit_price * item.quantity).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <button className="continue-shopping" onClick={() => navigate('/shop')}>
        Continue Shopping
      </button>
    </div>
  );
};

export default OrderConfirmation;
