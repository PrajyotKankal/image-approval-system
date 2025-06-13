const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
  username: { type: String, required: true },
  loginTime: { type: Date, default: Date.now },
  logoutTime: { type: Date } // optional until admin logs out
});

module.exports = mongoose.model('AdminLog', adminLogSchema);