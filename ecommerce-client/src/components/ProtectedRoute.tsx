import { Navigate } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: Props) => {
  const isAuthenticated = true; // Replace with real auth logic

  return isAuthenticated ? children : <Navigate to="/" />;
};
