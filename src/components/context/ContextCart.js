import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Create the Cart context
const CartContext = createContext();

// CartProvider component to wrap around the app
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const API_BASE = 'http://localhost:5000';

  // Add image to cart
  const addToCart = (image) => {
    if (cartItems.find((item) => item.asset_id === image.asset_id)) {
      return toast.info('Image already in cart');
    }
    setCartItems([...cartItems, image]);
  };

  // Remove image from cart
  const removeFromCart = (asset_id) => {
    setCartItems(cartItems.filter((item) => item.asset_id !== asset_id));
  };

  // Clear all items from cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Request selected images from admin
const requestImages = async () => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('No auth token found');
      console.error('❌ Missing token');
      return;
    }

    // Decode email
    const decoded = JSON.parse(atob(token.split('.')[1]));
    const email = decoded?.email;

    if (!email) {
      toast.error('Invalid token format');
      console.error('❌ Could not extract email from token:', decoded);
      return;
    }

    const payload = {
      userEmail: email,
      images: cartItems.map((img) => ({
        filename: img.filename || img.name || 'untitled',
        path: img.path || new URL(img.url).pathname || '',
      })),
    };

    console.log('📤 Sending payload to backend:', payload);

    await axios.post(`${API_BASE}/api/requests`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    toast.success('Images requested successfully');
    clearCart();
  } catch (err) {
    console.error('❌ Request failed:', err.response?.data || err.message);
    toast.error(err.response?.data?.message || 'Image request failed');
  }
};


  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        requestImages,
        setCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};


