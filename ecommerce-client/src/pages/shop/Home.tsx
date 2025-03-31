import { useEffect, useState } from 'react';
import { fetchAllProducts } from '../../services/productService';
import { ProductCard } from '../../components/ProductCard';
import '../../styles/core/home.scss';
import { IProduct } from '../../models/IProduct';
import { Link } from 'react-router-dom';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await fetchAllProducts();
        setFeaturedProducts(products.slice(0, 8));
      } catch (error) {
        console.error('Error loading products:', error);
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
        <div className="featured-grid">
          {loading
            ? Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="product-card loading">
                    <div className="image-container placeholder"></div>
                    <div className="product-info">
                      <div className="placeholder-text"></div>
                      <div className="placeholder-text short"></div>
                    </div>
                  </div>
                ))
            : featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </section>
    </div>
  );
}
