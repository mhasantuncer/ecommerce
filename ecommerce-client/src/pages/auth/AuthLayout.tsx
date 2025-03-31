import { Outlet } from 'react-router-dom';
import './AuthLayout.scss';

export const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <Outlet />
      </div>
    </div>
  );
};
