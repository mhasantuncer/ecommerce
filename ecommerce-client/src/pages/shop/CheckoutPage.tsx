// src/pages/shop/CheckoutPage.tsx
import { useState } from 'react';
import { useCart } from '../../hooks/useCart';
import { Spinner } from '../../components/Spinner';
import CartSummary from '../../components/checkout/CartSummary';
import CustomerForm from '../../components/checkout/CustomerForm';
import { customerService } from '../../services/customerService';
import { createOrder } from '../../services/orderService';
import { createCheckoutSession } from '../../services/stripeService';
import { ICustomer, CustomerFormValues } from '../../models/ICustomer';
import './CheckoutPage.scss';

interface StripeLineItem {
  price_data: {
    currency: string;
    product_data: {
      name: string;
    };
    unit_amount: number;
  };
  quantity: number;
}

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
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
          password: undefined, // Explicitly undefined since it's optional
        }));
      setCustomer(currentCustomer);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to process customer'
      );
    }
  };

  const handlePayment = async () => {
    if (!customer) {
      setError('Please complete customer information first');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // 1. Create order in database
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

      const { id: orderId } = await createOrder(orderData);

      // 2. Create Stripe checkout session
      const lineItems: StripeLineItem[] = cartItems.map((item) => ({
        price_data: {
          currency: 'sek',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));

      const { sessionId } = await createCheckoutSession({
        order_id: orderId,
        line_items: lineItems,
        success_url: `${window.location.origin}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/checkout`,
      });

      clearCart();
      window.location.href = sessionId;
    } catch (err) {
      console.error('Checkout failed:', err);
      setError(
        err instanceof Error ? err.message : 'Payment processing failed'
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
