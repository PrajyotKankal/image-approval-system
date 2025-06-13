// routes/adminUploadRoutes.js
const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { Readable } = require('stream');

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

const storage = multer.memoryStorage();
const upload = multer({ storage });

const bufferToStream = (buffer) => {
  const readable = new Readable();
  readable._read = () => {};
  readable.push(buffer);
  readable.push(null);
  return readable;
};

// router.post('/upload', upload.single('image'), async (req, res) => {
//   try {
//     const fileBuffer = req.file.buffer;
//     const tags = req.body.tags || '';

//     const uploadStream = cloudinary.uploader.upload_stream(
//       {
//         folder: 'image-request-app',
//         tags: tags.split(',').map((tag) => tag.trim()),
//         resource_type: 'image',
//       },
//       (error, result) => {
//         if (error) {
//           console.error('Cloudinary upload error:', error);
//           return res.status(500).json({ error: 'Upload failed' });
//         }
//         res.status(200).json({ message: 'Image uploaded', data: result });
//       }
//     );

//     bufferToStream(fileBuffer).pipe(uploadStream);
//   } catch (err) {
//     console.error('Upload error:', err);
//     res.status(500).json({ error: 'Server error during upload' });
//   }
// });

module.exports = router;
