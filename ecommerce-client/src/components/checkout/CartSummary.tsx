// src/components/checkout/CartSummary.tsx
import { useCart } from '../../hooks/useCart';
import './CartSummary.scss';

const CartSummary = () => {
  const { cartItems, updateQuantity, removeFromCart, totalPrice } = useCart();
  const formatSEK = (amount: number) => {
    return `${amount.toFixed(2)} SEK`;
  };
  return (
    <div className="cart-summary">
      <h2>Your Order</h2>
      <div className="items-list">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} className="item-image" />
            <div className="item-details">
              <h3>{item.name}</h3>
              <div className="quantity-controls">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="remove-btn"
              >
                Remove
              </button>
            </div>
            <div className="item-price">
              {formatSEK(item.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>
      <div className="order-total">
        <span>Total:</span>
        <span>{formatSEK(totalPrice)}</span>
      </div>
    </div>
  );
};

export default CartSummary;
