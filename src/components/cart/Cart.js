import React from 'react';
import { useCart } from '../context/ContextCart';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();

  const handleRequestImages = async () => {
    const token = localStorage.getItem('token');
    const userEmail = JSON.parse(atob(token.split('.')[1])).email;

    try {
      await Promise.all(
        cartItems.map((img) =>
          axios.post(
            'http://localhost:5000/api/requests',
            {
              userEmail,
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
    } catch (err) {
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
              <button className="cart-remove-btn" onClick={() => removeFromCart(img.asset_id)}>
                ❌
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        className="cart-submit-btn"
        disabled={cartItems.length === 0}
        onClick={handleRequestImages}
      >
        Request These Images
      </button>
    </div>
  );
};

export default Cart;
