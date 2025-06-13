const express = require('express');
const router = express.Router();
const User = require('../models/User');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

const otpStore = new Map();

// Send OTP
router.post('/send', async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'User not found' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(email, otp);
  setTimeout(() => otpStore.delete(email), 300000); // auto-delete in 5 mins

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Password Reset OTP',
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) return res.status(500).json({ message: 'Email sending failed' });
    res.json({ message: 'OTP sent' });
  });
});

// Verify OTP
router.post('/verify', (req, res) => {
  const { email, otp } = req.body;
  const storedOtp = otpStore.get(email);
  if (storedOtp === otp) {
    otpStore.set(email, 'verified');
    res.json({ success: true });
  } else {
    res.status(400).json({ message: 'Invalid OTP' });
  }
});

// Reset Password
router.post('/reset', async (req, res) => {
  const { email, newPassword } = req.body;
  if (otpStore.get(email) !== 'verified') {
    return res.status(400).json({ message: 'OTP not verified' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await User.findOneAndUpdate({ email }, { password: hashedPassword });
  otpStore.delete(email);
  res.json({ message: 'Password reset successful' });
});

module.exports = router;
