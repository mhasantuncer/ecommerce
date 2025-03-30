// src/pages/shop/CheckoutPage.tsx
import { useState } from 'react';
import { useCart } from '../../hooks/useCart';
import { Spinner } from '../../components/Spinner';
import CartSummary from '../../components/checkout/CartSummary';
import CustomerForm from '../../components/checkout/CustomerForm';
import { customerService } from '../../services/customerService';
import './CheckoutPage.scss';

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleFormSubmit = async (customerData: any) => {
    setIsProcessing(true);
    setError('');

    try {
      // 1. Check/create customer
      const customer =
        (await customerService.getByEmail(customerData.email)) ||
        (await customerService.create(customerData));

      // 2. Prepare order data (will implement next)
      const orderData = {
        customer_id: customer.id,
        payment_status: 'unpaid',
        payment_id: '',
        order_status: 'pending',
        order_items: cartItems.map((item) => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          unit_price: item.price,
        })),
      };

      console.log('Order ready for Stripe:', orderData);
      // 3. Next step: Stripe integration here
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to process customer'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart-message">
        <h2>Your cart is empty</h2>
        <p>Please add products before checkout</p>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      {isProcessing && <Spinner />}

      {error && <div className="error-message">{error}</div>}

      <section className="cart-summary-section">
        <CartSummary />
      </section>

      <section className="customer-form-section">
        <CustomerForm
          onValidSubmit={handleFormSubmit}
          disabled={isProcessing}
        />
      </section>
    </div>
  );
};

export default CheckoutPage;
