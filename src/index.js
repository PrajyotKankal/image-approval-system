// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { CartProvider } from './components/context/ContextCart';
import { DarkModeProvider } from './components/context/DarkModeContext';  // ✅

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <DarkModeProvider> {/* ✅ Wrap it */}
    <CartProvider>
      <App />
    </CartProvider>
  </DarkModeProvider>
);
