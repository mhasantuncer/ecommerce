import { useEffect } from 'react';
import { IProduct } from '../../../models/IProduct';
import '../../../styles/productspage.scss';
import { useProduct } from '../../../hooks/useProduct';
import { Link } from 'react-router-dom';

const ProductsPage = () => {
  const { products, isLoading, error, fetchProductsHandler } = useProduct();

  useEffect(() => {
    fetchProductsHandler();
  }, [fetchProductsHandler]);

  return (
    <div className="product-container">
      <h1>Products</h1>
      {error && <p>Error: {error.message || 'An unknown error occurred'}</p>}
      <div className="product-list">
        {isLoading && <h4>Loading...</h4>}
        {products?.map((product: IProduct) => {
          return (
            <div className="product-card" key={product.id}>
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>Price: {product.price}</p>
              <p>{product.stock > 0 ? 'In Stock' : 'No Stock'}</p>
              <Link to={'/shop/products/' + product.id}>Read more...</Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductsPage;
