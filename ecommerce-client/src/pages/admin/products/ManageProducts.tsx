import { useEffect } from 'react';
import { useProduct } from '../../../hooks/useProduct';
import { useNavigate } from 'react-router-dom';

export default function ManageProducts() {
  const {
    products,
    isLoading,
    error,
    fetchProductsHandler,
    deleteProductHandler,
  } = useProduct();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductsHandler();
  }, [fetchProductsHandler]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Products</h1>
      <button
        onClick={() => navigate('/admin/products/create')}
        className="btn btn-primary"
      >
        Add New Product
      </button>
      {isLoading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p className="text-red-500">{error.message}</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Price</th>
              <th className="border border-gray-300 px-4 py-2">Stock</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="text-center">
                <td className="border border-gray-300 px-4 py-2">
                  {product.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ${product.price}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {product.stock}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    className="btn btn-secondary mr-2"
                    onClick={() =>
                      navigate(`/admin/products/update/${product.id}`)
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteProductHandler(product.id.toString())}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
