// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const Admin = require('../models/adminCredentials');
const User = require('../models/User'); // ✅ Required for user count
const AdminLog = require('../models/AdminLog'); // ✅ Required for login/logout tracking



const jwt = require('jsonwebtoken');


// ✅ Admin Login Route with login tracking
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ message: 'Admin not found' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '2h' });

    // ✅ Log login time
    await new AdminLog({ username, loginTime: new Date() }).save();

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});


// // 🆕 Create New Admin (Public for now — you can protect it later)
// router.post('/create', async (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password)
//     return res.status(400).json({ message: 'Username and password required' });

//   try {
//     const existingAdmin = await Admin.findOne({ username });
//     if (existingAdmin)
//       return res.status(409).json({ message: 'Admin already exists' });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newAdmin = new Admin({ username, password: hashedPassword });
//     await newAdmin.save();

//     res.status(201).json({ message: 'New admin created successfully' });
//   } catch (err) {
//     console.error('Create Admin Error:', err.message);
//     res.status(500).json({ message: 'Server error' });
//   }
// });


// ✅ Admin Logout Route with logout tracking
router.post('/logout', async (req, res) => {
  const { username } = req.body;

  try {
    await AdminLog.findOneAndUpdate(
      { username, logoutTime: null },
      { logoutTime: new Date() },
      { sort: { loginTime: -1 } }
    );
    res.status(200).json({ message: 'Logout time recorded' });
  } catch (err) {
    console.error('Logout Log Error:', err.message);
    res.status(500).json({ message: 'Logout log error' });
  }
});



// Add a new admin
router.post('/add', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'All fields required' });

  try {
    const exists = await Admin.findOne({ username });
    if (exists) return res.status(400).json({ message: 'Admin already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ username, password: hashed });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// ✅ Admin Analytics Route
router.get('/analytics', async (req, res) => {
  try {
    const users = await User.find({}, 'email');
    const admins = await Admin.find({}, 'username');
    const logs = await AdminLog.find().sort({ loginTime: -1 });

    res.json({ users, admins, logs });
  } catch (err) {
    console.error('Analytics Fetch Error:', err);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});




module.exports = router;
