// src/components/cart/CartPage.js
import React from 'react';
import { useCart } from '../context/ContextCart';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();

  if (!cartItems || cartItems.length === 0) {
    return <div className="cart-empty-msg">🛒 Your cart is empty.</div>;
  }

  return (
    <div className="cart-page-container">
      <h2>Your Selected Images</h2>

      <div className="cart-grid">
        {cartItems.map((item) => (
          <div className="cart-card" key={item.asset_id}>
            <img src={item.url} alt="Selected" />
            <button onClick={() => removeFromCart(item.asset_id)}>Remove</button>
          </div>
        ))}
      </div>

      <div className="cart-actions">
        <button className="btn-clear" onClick={clearCart}>
          🗑 Clear Cart
        </button>
      </div>
    </div>
  );
};

export default CartPage;
