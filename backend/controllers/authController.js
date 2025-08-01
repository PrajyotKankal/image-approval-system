const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (userExist) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    // ✅ Include email in token payload
    const token = jwt.sign(
  { id: user._id, email: user.email, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed' });
  }
};

const Admin = require('../models/adminCredentials'); // ✅ Add this at the top

exports.login = async (req, res) => {
  const { identifier, password } = req.body; // ✅ use `identifier` instead of `email`

  try {
    // 🔍 Try User first
    let account = await User.findOne({ email: identifier });
    let role = 'user';

    // 🔍 If not found, try Admin
    if (!account) {
      account = await Admin.findOne({ username: identifier });
      role = 'admin';
    }

    if (!account) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, account.password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        id: account._id,
        email: account.email || account.username,
        role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed' });
  }
};
