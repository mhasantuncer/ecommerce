// src/components/CartDropdown.tsx
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import '../styles/cartdropdown.scss';

export const CartDropdown = () => {
  const { cartItems, totalItems, totalPrice, removeFromCart } = useCart();

  return (
    <div className="cart-dropdown">
      <div className="cart-header">
        <h4>Your Cart ({totalItems})</h4>
        <span>${totalPrice.toFixed(2)}</span>
      </div>

      {cartItems.length === 0 ? (
        <p className="empty-message">Your cart is empty</p>
      ) : (
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="item-details">
                <span>{item.name}</span>
                <span>
                  {item.quantity} x ${item.price.toFixed(2)}
                </span>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="remove-button"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <Link to="/cart" className="checkout-button">
        Go to Checkout
      </Link>
    </div>
  );
};
