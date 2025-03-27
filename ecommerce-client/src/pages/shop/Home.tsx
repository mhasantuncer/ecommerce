// src/pages/shop/Home.tsx
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchAllProducts } from '../../services/productService';
import { IProduct } from '../../models/IProduct';
import '../../styles/core/home.scss';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        console.log('Fetching products...'); // Debug log
        const products = await fetchAllProducts();
        console.log('All products:', products); // Debug log

        const featured = products.slice(0, 3);
        console.log('Featured products:', featured); // Debug log

        setFeaturedProducts(featured);
      } catch (err) {
        console.error('Error:', err); // Debug log
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="home-container">
      <section className="hero-section">
        <h1>Welcome to Our Shop</h1>
        <p>Discover our products</p>
        <Link to="/shop/products" className="cta-button">
          Shop Now
        </Link>
      </section>

      <section className="featured-section">
        <h2>Seasonal Specials</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="featured-grid">
          {loading ? (
            // Show placeholders while loading
            <>
              <div className="featured-item placeholder"></div>
              <div className="featured-item placeholder"></div>
              <div className="featured-item placeholder"></div>
            </>
          ) : (
            // Show actual products when loaded
            featuredProducts.map((product) => (
              <div key={product.id} className="featured-item">
                {product.image && (
                  <img
                    src={product.image || '/placeholder-product.jpg'}
                    alt={product.name}
                    className="product-image"
                    style={{ height: '180px', objectFit: 'cover' }} // Ensure consistent sizing
                  />
                )}
                <h3>{product.name}</h3>
                <p className="price">${product.price.toFixed(2)}</p>
                <div className="product-actions">
                  <Link
                    to={`/shop/products/${product.id}`}
                    className="view-button"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
