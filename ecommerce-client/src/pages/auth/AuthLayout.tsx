// src/pages/auth/AuthLayout.tsx
import { Outlet } from 'react-router-dom';
import './AuthLayout.scss'; // Optional styling file

export const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <Outlet /> {/* This will render the Login component */}
      </div>
    </div>
  );
};
