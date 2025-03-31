import { useState } from 'react';
import { useCart } from '../../hooks/useCart';
import { Spinner } from '../../components/Spinner';
import CartSummary from '../../components/checkout/CartSummary';
import CustomerForm from '../../components/checkout/CustomerForm';
import { customerService } from '../../services/customerService';
import { createCheckoutSession } from '../../services/stripeService';
import { ICustomer, CustomerFormValues } from '../../models/ICustomer';
import './CheckoutPage.scss';

const CheckoutPage = () => {
  const { cartItems } = useCart();
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [customer, setCustomer] = useState<ICustomer | null>(null);

  const handleFormSubmit = async (formData: CustomerFormValues) => {
    try {
      const existingCustomer = await customerService.getByEmail(formData.email);
      const currentCustomer =
        existingCustomer ||
        (await customerService.create({
          ...formData,
          password: undefined,
        }));
      setCustomer(currentCustomer);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to process customer'
      );
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setError('');

    try {
      const lineItems = cartItems.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const checkoutUrl = await createCheckoutSession(lineItems);
      window.location.href = checkoutUrl;
    } catch (err) {
      setError('Payment processing failed');
      console.error('Checkout error:', err);
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

      {customer && (
        <section className="payment-section">
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="pay-button"
          >
            {isProcessing ? 'Processing...' : `Pay SEK ${cartTotal.toFixed(2)}`}
          </button>
        </section>
      )}
    </div>
  );
};

export default CheckoutPage;
