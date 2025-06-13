import React, { useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/ContextCart';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ImageSearch.css'; // new CSS file

const ImageSearch = ({ onSearchStart }) => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const { addToCart } = useCart();

  const API_BASE = 'http://localhost:5000';

  const searchImages = async () => {
    if (!query.trim()) {
      toast.warning('Please enter a keyword or tag.');
      return;
    }

    if (onSearchStart) onSearchStart(); // trigger dashboard shift

    try {
      const res = await axios.get(`${API_BASE}/api/images/search?q=${query}`);
      setImages(res.data || []);
      if (res.data.length === 0) toast.info('No matching images found.');
    } catch (err) {
      toast.error('Failed to search images.');
    }
  };

  const handleAddToCart = (img) => {
    addToCart({
      asset_id: img.asset_id || img._id,
      filename: img.filename,
      path: img.path,
      url: `${API_BASE}${img.path}`
    });
    toast.success('Image added to cart');
  };

  return (
    <div className="image-search-container">
      {/* Search Bar */}
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search here"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={searchImages}>Search</button>
      </div>

      {/* Image Results */}
      {images.length === 0 && (
        <p className="no-results-text">Search images by name or tag to view results.</p>
      )}

      <div className="image-grid">
        {images.map((img, index) => (
          <div key={index} className="image-card">
            <img src={`${API_BASE}${img.path}`} alt={img.filename} />
            <p className="filename">{img.filename}</p>
            <div className="tags">
              {img.tags.map((tag, i) => (
                <span key={i} className="tag">{tag}</span>
              ))}
            </div>
            <button className="add-button" onClick={() => handleAddToCart(img)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSearch;
