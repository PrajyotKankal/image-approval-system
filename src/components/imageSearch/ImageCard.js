import React from 'react';
import { useCart } from '../context/ContextCart';
import { toast } from 'react-toastify';
import './ImageCard.css';

const API_BASE = 'http://localhost:5000';

const ImageCard = ({ image }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      asset_id: image.asset_id || image._id,
      filename: image.filename,
      path: image.path,
      url: `${API_BASE}${image.path}`
    });
    toast.success('Image added to cart');
  };

  return (
    <div className="image-card">
      <img
        src={`${API_BASE}${image.path}`}
        alt={image.filename}
        className="image-thumbnail"
        loading="lazy"
      />

      <button className="add-button" onClick={handleAddToCart}>
        Add to Cart
      </button>

      <p className="filename">{image.filename}</p>

      {image.tags && image.tags.length > 0 && (
        <div className="tags">
          {image.tags.map((tag, index) => (
            <span className="tag" key={index}>{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCard;
