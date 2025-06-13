import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate
import './ForgotPassword.css';

const ForgotPassword = () => {
  const navigate = useNavigate(); // ✅ Initialize navigate
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [resendTimer, setResendTimer] = useState(0);

  const sendOtp = async () => {
    try {
      await axios.post('http://localhost:5000/api/forgot-password/send', { email });
      toast.success('OTP sent to your email');
      setStep(2);
      setResendTimer(60);
    } catch {
      toast.error('Error sending OTP');
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/forgot-password/verify', { email, otp });
      if (res.data.success) {
        toast.success('OTP verified');
        setStep(3);
      } else {
        toast.error('Invalid OTP');
      }
    } catch {
      toast.error('OTP verification failed');
    }
  };

  const resetPassword = async () => {
    try {
      await axios.post('http://localhost:5000/api/forgot-password/reset', { email, newPassword });
      toast.success('Password reset successful');

      // Clear inputs
      setEmail('');
      setOtp('');
      setNewPassword('');
      setStep(1);

      // ✅ Redirect to login after short delay
      setTimeout(() => navigate('/login'), 1500);
    } catch {
      toast.error('Reset failed');
    }
  };

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => setResendTimer(t => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer]);

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <Toaster position="top-center" />
      <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
        <h4 className="text-center mb-4">Forgot Password</h4>

        {step === 1 && (
          <>
            <input
              type="email"
              className="form-control mb-3"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <button className="btn btn-primary w-100" onClick={sendOtp} disabled={resendTimer > 0}>
              {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Send OTP'}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Enter OTP"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              required
            />
            <button className="btn btn-success w-100 mb-2" onClick={verifyOtp}>Verify OTP</button>
          </>
        )}

        {step === 3 && (
          <>
            <input
              type="password"
              className="form-control mb-3"
              placeholder="Enter new password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
            <button className="btn btn-success w-100" onClick={resetPassword}>Reset Password</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
