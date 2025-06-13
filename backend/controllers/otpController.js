// controllers/otpController.js
const nodemailer = require('nodemailer');
const OTP = require('../models/otpModel');
const crypto = require('crypto');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.sendOTP = async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();

  const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

  await OTP.findOneAndUpdate(
    { email },
    { otp: otpHash, createdAt: Date.now() },
    { upsert: true, new: true }
  );

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"Image Portal" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP is ${otp}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const record = await OTP.findOne({ email });

    if (!record) {
      return res.status(400).json({ message: 'OTP not found for this email' });
    }

    const now = Date.now();
    const otpAge = now - new Date(record.createdAt).getTime();
    const tenMinutes = 10 * 60 * 1000;

    if (otpAge > tenMinutes) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    if (record.otp !== hashedOtp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    await OTP.deleteOne({ email });

    return res.status(200).json({ message: 'OTP verified successfully', success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error verifying OTP' });
  }
};
