import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useCart } from '../context/ContextCart';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();

  const requestImages = async () => {
    const token = localStorage.getItem('token');
    const email = JSON.parse(atob(token.split('.')[1])).email;

    try {
      await Promise.all(
        cartItems.map((img) =>
          axios.post(
            'http://localhost:5000/api/requests',
            {
              userEmail: email,
              imageId: img.asset_id,
              imageUrl: img.url,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
        )
      );
      toast.success('Request sent to admin');
      clearCart();
    } catch {
      toast.error('Failed to request images');
    }
  };

  return (
    <div className="cart-container">
      <h4 className="cart-heading">🛒 Your Cart ({cartItems.length})</h4>

      {cartItems.length === 0 ? (
        <p className="cart-empty-text">No images added to cart yet.</p>
      ) : (
        <div className="cart-items-list">
          {cartItems.map((img) => (
            <div className="cart-image-item" key={img.asset_id}>
              <img src={img.url} alt="preview" className="cart-thumbnail" />
              <button
                className="cart-remove-btn"
                onClick={() => removeFromCart(img.asset_id)}
                aria-label="Remove image"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18" />
                  <path d="M8 6v14h8V6" />
                  <path d="M10 11v6M14 11v6" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        className="cart-submit-btn"
        disabled={cartItems.length === 0}
        onClick={requestImages}
      >
        Request These Images
      </button>
    </div>
  );
};

export default Cart;
