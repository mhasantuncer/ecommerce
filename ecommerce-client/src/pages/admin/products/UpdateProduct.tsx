// src/pages/admin/products/UpdateProduct.tsx
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { IProduct } from '../../../models/IProduct';
import './UpdateProduct.scss';

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [formData, setFormData] = useState<Partial<IProduct>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/products/${id}`
        );
        setProduct(response.data);
        setFormData(response.data);
      } catch (err) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

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

    try {
      await axios.patch(`http://localhost:3000/products/${id}`, formData);
      navigate('/admin/products', {
        state: { success: 'Product updated successfully!' },
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className="loading-message">Loading product data...</div>;
  if (!product) return <div className="error-message">Product not found</div>;

  return (
    <div className="update-product">
      <h2>Update Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description || ''}
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
              value={formData.price || 0}
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
              value={formData.stock || 0}
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
            value={formData.category || ''}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Image URL</label>
          <input
            type="url"
            name="image"
            value={formData.image || ''}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>
        {location.state?.success && (
          <div className="success-message">{location.state.success}</div>
        )}

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Product'}
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

export default UpdateProduct;
