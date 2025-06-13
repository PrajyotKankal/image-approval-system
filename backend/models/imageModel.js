const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  path: { type: String, required: true }, // e.g. '/uploads/cat.jpg'
  tags: [{ type: String }],               // e.g. ['nature', 'sunset']
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Image', imageSchema);
