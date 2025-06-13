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
          <span onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? '🙈' : '👁️'}
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
