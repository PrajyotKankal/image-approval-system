const express = require('express');
const router = express.Router();
const User = require('../models/User'); // adjust path if needed
const { protectAdmin } = require('../middleware/authMiddleware'); // adjust path if needed

// DELETE /api/users/:id - Delete a user (admin only)
router.delete('/users/:id', protectAdmin, async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
