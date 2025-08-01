const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const imageController = require('../controllers/imageController');
const Image = require('../models/Image');


const fs = require('fs');
const path = require('path');
const { authenticateAdmin } = require('../middleware/authMiddleware');

const { protectAdmin } = require('../middleware/authMiddleware'); // ✅ make sure path is correct

// Change to this:
router.post('/upload', upload.array('images'), imageController.uploadImages);

router.put('/update-tags/:id', imageController.updateImageTags);



// Get all images
router.get('/', async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/search', async (req, res) => {
  const query = req.query.q; // ✅ Fix here
  try {
    const results = await Image.find({
      $or: [
        { filename: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } }
      ]
    });
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Search failed' });
  }
  
});

exports.updateImageTags = async (req, res) => {
  const { id } = req.params;
  const { tags } = req.body;

  try {
    const image = await Image.findById(id);
    if (!image) return res.status(404).json({ message: 'Image not found' });

    const newTags = Array.isArray(tags)
      ? tags
      : tags.split(',').map(tag => tag.trim()).filter(Boolean);

    // Merge and remove duplicates
    const mergedTags = Array.from(new Set([...(image.tags || []), ...newTags]));

    image.tags = mergedTags;
    await image.save();

    res.status(200).json({ message: 'Tags updated', tags: image.tags });
  } catch (error) {
    console.error('Error updating tags:', error);
    res.status(500).json({ message: 'Failed to update tags' });
  }
};





// DELETE image route
router.delete('/:id', async (req, res) => {
  try {
    const imageId = req.params.id;
    const image = await Image.findById(imageId);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    const filePath = path.join(__dirname, '..', image.path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Image.findByIdAndDelete(imageId);
    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Failed to delete image:', error);
    res.status(500).json({ message: 'Failed to delete image' });
  }
});


module.exports = router;
