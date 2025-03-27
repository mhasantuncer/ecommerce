import { useState } from 'react';
import { useCustomer } from '../../../hooks/useCustomer';

const CreateCustomer = () => {
  const { createCustomerHandler, isLoading, error } = useCustomer();
  const [customer, setCustomer] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    street_address: '',
    postal_code: '',
    city: '',
    country: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCustomerHandler(customer);
  };

  return (
    <div>
      <h2>Create Customer</h2>
      {error && <p style={{ color: 'red' }}>{error.message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstname"
          placeholder="First Name"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastname"
          placeholder="Last Name"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="street_address"
          placeholder="Street Address"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="postal_code"
          placeholder="Postal Code"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Customer'}
        </button>
      </form>
    </div>
  );
};

export default CreateCustomer;
