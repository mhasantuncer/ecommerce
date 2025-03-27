// src/components/Header.tsx
import { NavLink } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { CartDropdown } from './CartDropdown';
import { useEffect, useRef, useState } from 'react';
import '../styles/header.scss';

export const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const navRef = useRef<HTMLDivElement>(null);

  // Click outside handler (for both menu and cart)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
        setIsCartOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="header" ref={navRef}>
      <nav className="nav">
        <div className="nav-brand">E-Commerce Shop</div>

        {/* Hamburger Button (Mobile Only) */}
        <button
          className="hamburger"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-container ${isMenuOpen ? 'open' : ''}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
                title="Home"
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/shop/products"
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                Shop
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                Admin Dashboard
              </NavLink>
            </li>
            <li className="nav-item cart-icon-item">
              <button
                className="nav-link cart-icon"
                onClick={() => {
                  setIsCartOpen(!isCartOpen);
                  setIsMenuOpen(false);
                }}
                aria-label="Cart"
              >
                Cart
                {totalItems > 0 && (
                  <span className="cart-badge">{totalItems}</span>
                )}
              </button>
              {isCartOpen && <CartDropdown />}
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};
