const Image = require('../models/imageModel');
const path = require('path');
const fs = require('fs');

// Upload an image
// Upload multiple images
exports.uploadImages = async (req, res) => {
  try {
    const files = req.files; // use req.files for multiple uploads
    const tags = req.body.tags?.split(',').map(tag => tag.trim()) || [];

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    const savedImages = await Promise.all(
      files.map(file => {
        const newImage = new Image({
          filename: file.filename,
          path: `/uploads/${file.filename}`,
          tags,
        });
        return newImage.save();
      })
    );

    res.status(201).json({ message: 'Images uploaded successfully', images: savedImages });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Server error during image upload' });
  }
};

// Get all images
exports.getImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ uploadedAt: -1 });
    res.json(images);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ message: 'Error fetching images' });
  }
};

// Search images by filename or tags
exports.searchImages = async (req, res) => {
  try {
    const q = req.query.q || '';
    const images = await Image.find({
      $or: [
        { filename: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } },
      ],
    });
    res.json(images);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Error during image search' });
  }
};

// Update tags for an existing image
exports.updateImageTags = async (req, res) => {
  try {
    const { id } = req.params;
    const tags = req.body.tags?.split(',').map(tag => tag.trim()) || [];

    const image = await Image.findByIdAndUpdate(
      id,
      { tags },
      { new: true }
    );

    if (!image) return res.status(404).json({ message: 'Image not found' });

    res.json({ message: 'Tags updated successfully', image });
  } catch (err) {
    console.error('Tag update error:', err);
    res.status(500).json({ message: 'Server error while updating tags' });
  }
};
