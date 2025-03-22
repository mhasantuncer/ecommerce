import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProduct } from '../../hooks/useProduct';
import { IProduct } from '../../models/IProduct';
import '../../styles/productdetails.scss';

export const ProductDetails = () => {
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
      {error && <p>Error: {error.message || 'An unknown error occurred'}</p>}
      {isLoading && <h4>Loading...</h4>}
      <div className="product-card-detail" key={product.id}>
        <div>
          <img src={product.image} alt={product.name} />
        </div>
        <div>
          <h3>{product.name}</h3>
          <p>
            <b>Description:</b> {product.description}
          </p>
          <p>
            <b>Category:</b> {product.category}
          </p>
          <p>
            <b>Price:</b> {product.price}
          </p>
          <p>
            <b>Stock:</b> {product.stock}
          </p>
        </div>
      </div>
    </>
  );
};
