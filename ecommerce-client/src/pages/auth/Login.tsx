// src/pages/auth/Login.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/adminService';
import './Login.scss'; // Optional styling file

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Attempting login with:', { username, password }); // Log input
      const { token } = await authService.login(username, password);
      console.log('Login successful, token:', token); // Log success
      login(token);
      navigate('/admin/products');
    } catch (err) {
      console.error('Full login error:', err); // Detailed error log
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-form">
      <h2>Admin Login</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
      {/* Add forgot password or other links if needed */}
    </div>
  );
};

export default Login;
