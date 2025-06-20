import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useCart } from '../context/ContextCart';
import { toast } from 'react-toastify';
import './ImageSearch.css';

const API_BASE = 'http://localhost:5000';

const ImageSearch = ({ onSearchStart }) => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);

  const { addToCart } = useCart();

  const searchImages = async () => {
    if (!query.trim()) return toast.warning('Please enter a keyword or tag.');
    if (onSearchStart) onSearchStart();

    try {
      const res = await axios.get(`${API_BASE}/api/images/search?q=${query}`);
      setImages(res.data || []);
      if (res.data.length === 0) toast.info('No matching images found.');
    } catch {
      toast.error('Failed to search images.');
    }
  };

  const handleAddToCart = (img) => {
    addToCart({
      asset_id: img.asset_id || img._id,
      filename: img.filename,
      path: img.path,
      url: `${API_BASE}${img.path}`,
    });
    toast.success('Image added to cart');
  };

  const openFullscreen = (index) => {
    setCurrentIndex(index);
    setFullscreenImage(`${API_BASE}${images[index].path}`);
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
    setCurrentIndex(null);
  };

  const goToPrevious = useCallback((e) => {
    e.stopPropagation();
    const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    setCurrentIndex(newIndex);
    setFullscreenImage(`${API_BASE}${images[newIndex].path}`);
  }, [currentIndex, images]);

  const goToNext = useCallback((e) => {
    e.stopPropagation();
    const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    setFullscreenImage(`${API_BASE}${images[newIndex].path}`);
  }, [currentIndex, images]);

  useEffect(() => {
    const handleKey = (e) => {
      if (!fullscreenImage) return;
      if (e.key === 'ArrowRight') goToNext(e);
      if (e.key === 'ArrowLeft') goToPrevious(e);
      if (e.key === 'Escape') closeFullscreen();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [fullscreenImage, goToNext, goToPrevious]);

  return (
    <div className="image-search-wrapper">
      <div className="search-bar-modern">
        <input
          type="text"
          placeholder="Search image..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={searchImages}>Search</button>
      </div>

      <div className="modern-grid">
        {images.map((img, i) => (
          <div className="modern-card" key={i}>
            <img
              src={`${API_BASE}${img.path}`}
              alt={img.filename}
              onClick={() => openFullscreen(i)}
            />
            <button className="plus-button" onClick={() => handleAddToCart(img)}>＋</button>
            <div className="overlay-info">
              <div className="modern-title">{img.filename}</div>
            </div>
          </div>
        ))}
      </div>

      {fullscreenImage && (
        <div className="fullscreen-overlay" onClick={closeFullscreen}>
          <img
            key={fullscreenImage}
            src={fullscreenImage}
            alt="fullscreen"
            className="fullscreen-img"
          />

          <button className="close-btn" onClick={closeFullscreen} aria-label="Close">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <button className="arrow-btn left-arrow" onClick={goToPrevious}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <button className="arrow-btn right-arrow" onClick={goToNext}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageSearch;
