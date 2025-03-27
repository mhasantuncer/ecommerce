import { Link } from 'react-router-dom';
import { IProduct } from '../models/IProduct';
import placeholderImage from '../assets/3d-delivery-robot-working.jpg';

interface ProductCardProps {
  product: IProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="product-card">
      <div className="image-container">
        <img
          src={product.image || placeholderImage}
          alt={product.name}
          className="product-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src = placeholderImage;
          }}
        />
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="price">${product.price.toFixed(2)}</p>
        <Link to={`/shop/products/${product.id}`} className="view-button">
          View Details
        </Link>
      </div>
    </div>
  );
};
