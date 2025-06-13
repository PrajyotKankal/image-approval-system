import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AdminUpload.css';


const AdminUpload = () => {
  const [image, setImage] = useState(null);
  const [tags, setTags] = useState('');
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image) return toast.error('Please select an image');

    const formData = new FormData();
    formData.append('image', image);
    formData.append('tags', tags);

    try {
      await axios.post('http://localhost:5000/api/images/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Image uploaded successfully');
      setImage(null);
      setTags('');
      setPreview(null);
    } catch (err) {
      toast.error('Upload failed');
      console.error(err);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Admin - Upload Image to Server</h2>

      <form onSubmit={handleUpload} className="mt-4 p-4 border rounded shadow bg-white">
        <div className="mb-3">
          <label className="form-label">Select Image</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>

        {preview && (
          <div className="mb-3">
            <img
              src={preview}
              alt="Preview"
              className="img-thumbnail"
              style={{
                maxHeight: '250px',
                objectFit: 'cover',
                width: '100%',
                borderRadius: '10px'
              }}
            />
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Tags (comma separated)</label>
          <input
            type="text"
            className="form-control"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g. nature, people, tech"
          />
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Upload Image
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminUpload;
