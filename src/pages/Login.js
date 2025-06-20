import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        navigate(decoded.role === 'admin' ? '/user/dashboard' : '/user/dashboard');
      } catch (e) {
        localStorage.removeItem('token');
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        identifier,
        password
      });

      const { token } = res.data;
      if (token) {
        localStorage.setItem('token', token);
        toast.success('Login successful!');
        const decoded = JSON.parse(atob(token.split('.')[1]));
        navigate(decoded.role === 'admin' ? '/user/dashboard' : '/user/dashboard');
      } else {
        toast.error('No token received');
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="login-container"
    >
      <div className="login-wrapper">
        <div className="login-box">
          <h2 className="login-title">Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              className="form-control"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Email"
            />
            <input
              type="password"
              className="form-control"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />

            <div className="forgot-link-wrap">
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="signup-text">
            Don’t have an account?{' '}
            <Link to="/signup" className="signup-link">Sign up</Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
