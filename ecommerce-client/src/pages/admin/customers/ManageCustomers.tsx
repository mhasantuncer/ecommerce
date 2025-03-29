// src/pages/admin/customers/ManageCustomers.tsx
import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { ICustomer } from '../../../models/ICustomer';
import axios from 'axios';

const ManageCustomers = () => {
  const { isAuthenticated } = useAuth();
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/customers');
        setCustomers(response.data);
      } catch (err) {
        setError('Failed to fetch customers');
        console.error('Error fetching customers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [isAuthenticated]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this customer?'))
      return;

    try {
      await axios.delete(`http://localhost:3000/customers/${id}`);
      setCustomers(customers.filter((customer) => customer.id !== id));
    } catch (err) {
      setError('Failed to delete customer');
      console.error('Error deleting customer:', err);
    }
  };

  if (!isAuthenticated) return <div>Please login to access this page</div>;

  if (loading) return <div>Loading customers...</div>;

  if (error) return <div>{error}</div>;

  return (
    <div className="manage-customers">
      <h1>Manage Customers</h1>

      <table className="customers-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>
                {customer.firstname} {customer.lastname}
              </td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td>
                {customer.street_address}, {customer.postal_code},{' '}
                {customer.city}, {customer.country}
              </td>
              <td>
                <button
                  onClick={() => console.log('Edit customer:', customer.id)}
                  className="edit-btn"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(customer.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageCustomers;
