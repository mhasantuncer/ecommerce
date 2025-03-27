import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProduct } from '../../../hooks/useProduct';
import { IProduct } from '../../../models/IProduct';
import '../../../styles/productdetails.scss';
import { Spinner } from '../../../components/Spinner';

const ProductDetails = () => {
  const [product, setProduct] = useState<IProduct | null>(null);
  const { id } = useParams();
  const { isLoading, error, fetchProductByIdHandler } = useProduct();

  useEffect(() => {
    if (!id) return;
    fetchProductByIdHandler(id).then((data) => setProduct(data));
  }, [id, fetchProductByIdHandler]);
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
          <div>
            <img src={product.image} alt={product.name} />
          </div>
          <div>
            <h3>{product.name}</h3>
            <p className={product.stock > 0 ? 'in-stock' : 'out-of-stock'}>
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
            <button className="add-to-cart">
              <span>Add to Cart</span>
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
