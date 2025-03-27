import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProduct } from '../../../hooks/useProduct';
import { IProduct } from '../../../models/IProduct';
import '../../../styles/productdetails.scss';
import { Spinner } from '../../../components/Spinner';
import { useCart } from '../../../context/CartContext'; // Import cart context

const ProductDetails = () => {
  const [product, setProduct] = useState<IProduct | null>(null);
  const { id } = useParams();
  const { isLoading, error, fetchProductByIdHandler } = useProduct();
  const { addToCart } = useCart(); // Get addToCart function from context

  useEffect(() => {
    if (!id) return;
    fetchProductByIdHandler(id).then((data) => setProduct(data));
  }, [id, fetchProductByIdHandler]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1, // Default quantity
      });
    }
  };

  if (!product) return <p>Product not found.</p>;

  return (
    <>
      {error && (
        <p className="error-message" role="alert">
          Error: {error.message || 'An unknown error occurred'}
        </p>
      )}
      {isLoading ? (
        <div className="loading-indicator">
          <Spinner />
        </div>
      ) : product ? (
        <div className="product-card-detail">
          <div className="product-image-container">
            <img src={product.image} alt={product.name} />
          </div>
          <div className="product-info">
            <h3>{product.name}</h3>
            <p
              className={`stock-status ${
                product.stock > 0 ? 'in-stock' : 'out-of-stock'
              }`}
            >
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </p>
            <p>
              <b>Description:</b> {product.description}
            </p>
            <p>
              <b>Category:</b> {product.category}
            </p>
            <p>
              <b>Price:</b> ${product.price.toFixed(2)}
            </p>
            <button
              className="add-to-cart"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              <span>{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
            </button>
          </div>
        </div>
      ) : (
        <p>Product not found.</p>
      )}
    </>
  );
};

export default ProductDetails;
