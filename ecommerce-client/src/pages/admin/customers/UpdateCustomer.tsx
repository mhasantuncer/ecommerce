// src/pages/admin/customers/UpdateCustomer.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { ICustomer, CustomerUpdate } from '../../../models/ICustomer';
import axios from 'axios';
import './UpdateCustomer.scss'; // We'll create this CSS file

const UpdateCustomer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [customer, setCustomer] = useState<ICustomer | null>(null);
  const [formData, setFormData] = useState<CustomerUpdate>({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    street_address: '',
    postal_code: '',
    city: '',
    country: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchCustomer = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/customers/${id}`
        );
        setCustomer(response.data);
        setFormData({
          firstname: response.data.firstname,
          lastname: response.data.lastname,
          email: response.data.email,
          phone: response.data.phone,
          street_address: response.data.street_address,
          postal_code: response.data.postal_code,
          city: response.data.city,
          country: response.data.country,
        });
      } catch (err) {
        setError('Failed to fetch customer data');
        console.error('Error fetching customer:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id, isAuthenticated]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.patch(`http://localhost:3000/customers/${id}`, formData);
      setSuccess('Customer updated successfully!');
      setTimeout(() => navigate('/admin/customers'), 1500);
    } catch (err) {
      setError('Failed to update customer');
      console.error('Error updating customer:', err);
    }
  };

  if (!isAuthenticated)
    return <div className="auth-warning">Please login to access this page</div>;

  if (loading)
    return <div className="loading-message">Loading customer data...</div>;

  if (!customer) return <div className="error-message">Customer not found</div>;

  return (
    <div className="update-customer-container">
      <h1 className="page-title">Update Customer</h1>
      <Link to="/admin/customers" className="back-link">
        &larr; Back to Customers
      </Link>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="customer-form">
        <div className="form-group">
          <label htmlFor="firstname">First Name</label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastname">Last Name</label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="street_address">Street Address</label>
          <input
            type="text"
            id="street_address"
            name="street_address"
            value={formData.street_address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="postal_code">Postal Code</label>
          <input
            type="text"
            id="postal_code"
            name="postal_code"
            value={formData.postal_code}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="country">Country</label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">
            Update Customer
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate('/admin/customers')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCustomer;
