import { useEffect } from 'react';
import { IProduct } from '../../../models/IProduct';
import '../../../styles/productspage.scss';
import { useProduct } from '../../../hooks/useProduct';
import { Link } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';

const ProductsPage = () => {
  const { products, isLoading, error, fetchProductsHandler } = useProduct();
  const { addToCart } = useCart();
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
              <div className="image-container">
                <img src={product.image} alt={product.name} />
              </div>
              <h3>{product.name}</h3>
              <p>Price: {product.price}</p>
              <p>{product.stock > 0 ? 'In Stock' : 'No Stock'}</p>
              <button
                onClick={() =>
                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                  })
                }
                className="add-to-cart-button"
                disabled={product.stock <= 0}
              >
                Add to Cart
              </button>
              <Link to={'/shop/products/' + product.id}>Read more...</Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductsPage;
