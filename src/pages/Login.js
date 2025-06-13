import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import girlTwo from '../assets/girltwo.png'; // pastel 3D girl with bean bag
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
      <div className="login-left">
        <div className="card p-4 shadow">
          <h3 className="text-center mb-4">Login</h3>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Email"
              />
            </div>
            <div className="mb-2">
              <input
                type="password"
                className="form-control"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>

            <div className="text-end mb-3">
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 mb-4"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center mb-2">
            Don’t have an account? <Link to="/signup" className="signup-link">Sign up</Link>
          </p>
        </div>
      </div>

      <div className="right-image">
        <img src={girlTwo} alt="Illustration" />
      </div>
    </motion.div>
  );
};

export default Login;
