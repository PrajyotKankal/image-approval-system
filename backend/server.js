const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize express app ✅
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/requests', require('./routes/requestRoutesLocal'));
console.log('✔️ /api/requests route loaded');


const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admins', adminRoutes);


app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/otp', require('./routes/otpRoutes'));
app.use('/api/forgot-password', require('./routes/RouteForgotPassword.js'));

// Admin upload routes
const adminUploadRoutes = require('./routes/adminUploadRoutes');
app.use('/api/admin', adminUploadRoutes);

// Image upload and listing
const imageRoutes = require('./routes/imageRoutes');
app.use('/api/images', imageRoutes);


// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
