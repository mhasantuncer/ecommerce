// src/pages/admin/products/ManageProducts.tsx
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { IProduct } from '../../../models/IProduct';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ManageProducts.scss';

// Icons (using same approach as ManageCustomers)
const PlusIcon = () => (
  <svg className="icon" viewBox="0 0 24 24" width="16" height="16">
    <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="icon" viewBox="0 0 24 24" width="16" height="16">
    <path
      fill="currentColor"
      d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
    />
  </svg>
);

const ITEMS_PER_PAGE = 10;

const ManageProducts = () => {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/products');
        setProducts(response.data);
        setFilteredProducts(response.data);
        setTotalPages(Math.ceil(response.data.length / ITEMS_PER_PAGE));
      } catch (err) {
        setError('Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [isAuthenticated]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?'))
      return;

    try {
      await axios.delete(`http://localhost:3000/products/${id}`);
      const updatedProducts = products.filter((product) => product.id !== id);
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      setTotalPages(Math.ceil(updatedProducts.length / ITEMS_PER_PAGE));
    } catch (err) {
      setError('Failed to delete product');
      console.error('Error deleting product:', err);
    }
  };

  const handleSearch = useCallback(() => {
    const term = searchTerm.toLowerCase();
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.price.toString().includes(term)
    );
    setFilteredProducts(filtered);
    setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
    setCurrentPage(1);
  }, [searchTerm, products]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (!isAuthenticated)
    return <div className="auth-warning">Please login to access this page</div>;

  return (
    <div className="manage-products-container">
      <div className="admin-header">
        <h1 className="page-title">Manage Products</h1>
      </div>

      <div className="controls-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button">
            <SearchIcon /> Search
          </button>
        </div>
        <div className="action-buttons">
          <Link to="/admin/products/create" className="create-button">
            <PlusIcon /> Create Product
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="loading-message">Loading products...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <div className="table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>{product.stock}</td>
                    <td>{product.category}</td>
                    <td className="actions-cell">
                      <Link
                        to={`/admin/products/update/${product.id}`}
                        className="edit-button"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
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

export default ManageProducts;
