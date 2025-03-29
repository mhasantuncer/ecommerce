// src/pages/admin/customers/ManageCustomers.tsx
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { ICustomer } from '../../../models/ICustomer';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ManageCustomers.scss';
import { FiPlus, FiSearch } from 'react-icons/fi';

const ITEMS_PER_PAGE = 10;

const ManageCustomers = () => {
  const { isAuthenticated } = useAuth();
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<ICustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/customers');
        setCustomers(response.data);
        setFilteredCustomers(response.data);
        setTotalPages(Math.ceil(response.data.length / ITEMS_PER_PAGE));
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
      const updatedCustomers = customers.filter(
        (customer) => customer.id !== id
      );
      setCustomers(updatedCustomers);
      setFilteredCustomers(updatedCustomers);
      setTotalPages(Math.ceil(updatedCustomers.length / ITEMS_PER_PAGE));
    } catch (err) {
      setError('Failed to delete customer');
      console.error('Error deleting customer:', err);
    }
  };

  const handleSearch = useCallback(() => {
    const term = searchTerm.toLowerCase();
    const filtered = customers.filter(
      (customer) =>
        customer.firstname.toLowerCase().includes(term) ||
        customer.lastname.toLowerCase().includes(term) ||
        customer.email.toLowerCase().includes(term) ||
        customer.phone.toLowerCase().includes(term)
    );
    setFilteredCustomers(filtered);
    setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
    setCurrentPage(1);
  }, [searchTerm, customers]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (!isAuthenticated)
    return <div className="auth-warning">Please login to access this page</div>;

  return (
    <div className="manage-customers-container">
      <div className="admin-header">
        <h1 className="page-title">Manage Customers</h1>
      </div>

      <div className="controls-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button">
            <FiSearch className="icon" /> Search
          </button>
        </div>
        <div className="action-buttons">
          <Link to="/admin/customers/create" className="create-button">
            <FiPlus className="icon" /> Create Customer
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="loading-message">Loading customers...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <div className="table-container">
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
                {paginatedCustomers.map((customer) => (
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
                    <td className="actions-cell">
                      <Link
                        to={`/admin/customers/update/${customer.id}`}
                        className="edit-button"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(customer.id)}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination-container">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                Previous
              </button>
              <span className="page-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManageCustomers;
