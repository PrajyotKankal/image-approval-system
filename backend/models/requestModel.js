const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  images: [
    {
      filename: { type: String },
      path: { type: String }
    }
  ],

  
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  approvedBy: { type: String, default: 'username' }
}, {
  timestamps: true  // ✅ Adds createdAt and updatedAt
});

module.exports = mongoose.model('Request', requestSchema);
