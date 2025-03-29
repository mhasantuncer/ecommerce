import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IProduct } from '../../../models/IProduct';
import './CreateProduct.scss';

const CreateProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState<Omit<IProduct, 'id' | 'created_at'>>(
    {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: '',
      image: '',
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);
  const progressInterval = useRef<number>(0);

  // Handle location state messages
  useEffect(() => {
    if (location.state?.success) {
      showMessage(location.state.success, 'success');
    }
  }, [location.state]);

  // Clean up intervals on unmount
  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  const showMessage = (message: string, type: 'success' | 'error') => {
    // Clear existing messages and timers
    clearInterval(progressInterval.current);
    setIsExiting(false);
    setProgress(100);

    // Set the new message
    if (type === 'success') {
      setSuccess(message);
      setError('');
    } else {
      setError(message);
      setSuccess('');
    }

    // Start progress indicator
    const duration = type === 'success' ? 3000 : 5000;
    const startTime = Date.now();

    progressInterval.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining <= 0) {
        clearInterval(progressInterval.current);
        setIsExiting(true);
        setTimeout(() => {
          if (type === 'success') {
            setSuccess('');
          } else {
            setError('');
          }
        }, 500);
      }
    }, 50);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setIsExiting(false);

    try {
      await axios.post('http://localhost:3000/products', formData);
      navigate(`/admin/products/`, {
        state: { success: 'Product created successfully!' },
      });
    } catch (err) {
      showMessage(
        err.response?.data?.message || 'Failed to create product',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const dismissMessage = (type: 'success' | 'error') => {
    clearInterval(progressInterval.current);
    setIsExiting(true);
    setTimeout(() => {
      if (type === 'success') {
        setSuccess('');
      } else {
        setError('');
      }
    }, 500);
  };

  return (
    <div className="create-product">
      <h2>Create New Product</h2>

      {/* Success Message */}
      {success && (
        <div className={`success-message ${isExiting ? 'exiting' : ''}`}>
          <div className="message-content">
            {success}
            <button
              className="close-message"
              onClick={() => dismissMessage('success')}
              aria-label="Dismiss success message"
            >
              &times;
            </button>
          </div>
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className={`error-message ${isExiting ? 'exiting' : ''}`}>
          <div className="message-content">
            {error}
            <button
              className="close-message"
              onClick={() => dismissMessage('error')}
              aria-label="Dismiss error message"
            >
              &times;
            </button>
          </div>
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Price *</label>
            <input
              type="number"
              name="price"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Stock *</label>
            <input
              type="number"
              name="stock"
              min="0"
              value={formData.stock}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Category *</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Image URL</label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
