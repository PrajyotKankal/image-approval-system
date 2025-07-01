// src/pages/Signup.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const sendOtp = async () => {
    if (!formData.email) return toast.error('Enter email first');
    try {
      await axios.post('http://localhost:5000/api/otp/send', { email: formData.email });
      toast.success('OTP sent to your email');
      setOtpSent(true);
      setResendTimer(60);
    } catch (err) {
      toast.error('Failed to send OTP');
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/otp/verify', {
        email: formData.email,
        otp,
      });
      if (res.data.success) {
        toast.success('OTP Verified');
        setOtpVerified(true);
      } else {
        toast.error(res.data.message || 'Invalid OTP');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'OTP verification failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) return toast.error('Please verify OTP first');

    try {
      await axios.post('http://localhost:5000/api/auth/signup', formData);
      toast.success('Signup successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (resendTimer > 0) setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  return (
    <div className="signup-container">
      <Toaster position="top-center" />
      <form onSubmit={handleSubmit} className="signup-form">
        <h2>Create Account</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        {!otpSent ? (
          <button type="button" className="otp-button" onClick={sendOtp}>
            Send OTP
          </button>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button type="button" className="otp-button" onClick={verifyOtp}>
              Verify OTP
            </button>
            <button
              type="button"
              className="resend-button"
              onClick={sendOtp}
              disabled={resendTimer > 0}
            >
              {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
            </button>
          </>
        )}

        <div className="password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <span onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>
  {showPassword ? (
    // Eye Slash Icon (Hide Password)
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94L6.06 6.06" />
      <path d="M10.58 10.58a3 3 0 0 0 4.24 4.24" />
      <path d="M9.88 4.12a10.94 10.94 0 0 1 10.09 6.88" />
      <path d="M1 1l22 22" />
      <path d="M3.5 3.5C2 5 1 7 1 7s4 7 11 7c1.5 0 3-.25 4.5-.75" />
    </svg>
  ) : (
    // Eye Icon (Show Password)
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )}
</span>

        </div>

        <button type="submit" disabled={!otpVerified}>
          Sign Up
        </button>
        
      </form>
      
    </div>
  );
};

export default Signup;
