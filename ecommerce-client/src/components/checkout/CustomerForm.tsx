import { useState, useEffect } from 'react';
import {
  CustomerFormValues,
  CustomerFormErrors,
  CustomerFormProps,
} from '../../models/ICustomer';
import './CustomerForm.scss';

const CustomerForm = ({
  onValidSubmit,
  disabled = false,
  initialValues = {},
}: CustomerFormProps) => {
  const [formData, setFormData] = useState<CustomerFormValues>(() => {
    const defaultValues: CustomerFormValues = {
      email: '',
      firstname: '',
      lastname: '',
      phone: '',
      street_address: '',
      postal_code: '',
      city: '',
      country: 'Sweden',
    };

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('customerFormData');
      return saved ? JSON.parse(saved) : { ...defaultValues, ...initialValues };
    }
    return { ...defaultValues, ...initialValues };
  });

  const [errors, setErrors] = useState<CustomerFormErrors>({});

  useEffect(() => {
    localStorage.setItem('customerFormData', JSON.stringify(formData));
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof CustomerFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: CustomerFormErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.firstname) newErrors.firstname = 'First name is required';
    if (!formData.lastname) newErrors.lastname = 'Last name is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.street_address)
      newErrors.street_address = 'Address is required';
    if (!formData.postal_code)
      newErrors.postal_code = 'Postal code is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.country) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disabled && validate()) {
      onValidSubmit(formData);
    }
  };
  return (
    <form className="customer-form" onSubmit={handleSubmit}>
      <h2>Customer Information</h2>

      <div className="form-row">
        <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
          <label htmlFor="email">Email*</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={disabled}
          />
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className={`form-group ${errors.firstname ? 'has-error' : ''}`}>
          <label htmlFor="firstname">First Name*</label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            disabled={disabled}
          />
          {errors.firstname && (
            <span className="error-message">{errors.firstname}</span>
          )}
        </div>

        <div className={`form-group ${errors.lastname ? 'has-error' : ''}`}>
          <label htmlFor="lastname">Last Name*</label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            disabled={disabled}
          />
          {errors.lastname && (
            <span className="error-message">{errors.lastname}</span>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className={`form-group ${errors.phone ? 'has-error' : ''}`}>
          <label htmlFor="phone">Phone*</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={disabled}
          />
          {errors.phone && (
            <span className="error-message">{errors.phone}</span>
          )}
        </div>
      </div>

      <div className="form-row">
        <div
          className={`form-group ${errors.street_address ? 'has-error' : ''}`}
        >
          <label htmlFor="street_address">Street Address*</label>
          <input
            type="text"
            id="street_address"
            name="street_address"
            value={formData.street_address}
            onChange={handleChange}
            disabled={disabled}
          />
          {errors.street_address && (
            <span className="error-message">{errors.street_address}</span>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className={`form-group ${errors.postal_code ? 'has-error' : ''}`}>
          <label htmlFor="postal_code">Postal Code*</label>
          <input
            type="text"
            id="postal_code"
            name="postal_code"
            value={formData.postal_code}
            onChange={handleChange}
            disabled={disabled}
          />
          {errors.postal_code && (
            <span className="error-message">{errors.postal_code}</span>
          )}
        </div>

        <div className={`form-group ${errors.city ? 'has-error' : ''}`}>
          <label htmlFor="city">City*</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            disabled={disabled}
          />
          {errors.city && <span className="error-message">{errors.city}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className={`form-group ${errors.country ? 'has-error' : ''}`}>
          <label htmlFor="country">Country*</label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            disabled={disabled}
          >
            <option value="Sweden">Sweden</option>
            <option value="Norway">Norway</option>
            <option value="Denmark">Denmark</option>
            <option value="Finland">Finland</option>
          </select>
          {errors.country && (
            <span className="error-message">{errors.country}</span>
          )}
        </div>
      </div>

      <button type="submit" className="submit-button" disabled={disabled}>
        {disabled ? 'Processing...' : 'Proceed to Payment'}
      </button>
    </form>
  );
};

export default CustomerForm;
