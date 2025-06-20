import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminLogin from './pages/AdminLogin';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminUpload from './pages/AdminUpload';
import ForgotPassword from './pages/ForgotPassword';

import RequireAuth from './components/RequireAuth';
import RequireAdmin from './components/RequireAdmin';



import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css';




function AnimatedRoutes() {
  const location = useLocation();

  return (

    <>

      <AnimatePresence mode="wait">


        <Routes location={location} key={location.pathname}>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected user routes */}
          <Route
            path="/user/dashboard"
            element={
              <RequireAuth>
                <UserDashboard />
              </RequireAuth>
            }
          />

          {/* Protected admin routes */}
          <Route
            path="/admin/dashboard"
            element={
              <RequireAdmin>
                <AdminDashboard />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/upload"
            element={
              <RequireAdmin>
                <AdminUpload />
              </RequireAdmin>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
      <ToastContainer
  position="top-center"
  autoClose={1000}                     // 1 second
  hideProgressBar
  closeOnClick
  pauseOnHover={false}
  draggable={false}
  pauseOnFocusLoss={false}
  limit={3}
  toastStyle={{
    backgroundColor: '#e0e0e0',        // Faint gray
    color: '#333',                     // Dark text
    fontSize: '0.9rem',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    textAlign: 'center',
  }}
/>
   </Router>
  );
}

export default App;
