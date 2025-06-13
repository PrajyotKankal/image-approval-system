import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminUploadForm = () => {
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState('');

  const handleUpload = async () => {
    if (!file) return toast.warning('Please select an image');
    const formData = new FormData();
    formData.append('image', file);
    formData.append('tags', tags);

    try {
      await axios.post('http://localhost:5000/api/images/upload', formData);
      toast.success('Image uploaded successfully');
      setFile(null);
      setTags('');
    } catch {
      toast.error('Upload failed');
    }
  };

  return (
    <div className="upload-form">
      <h3>📤 Upload New Image</h3>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <input
        type="text"
        placeholder="Enter tags (comma-separated)"
        value={tags}
        onChange={e => setTags(e.target.value)}
        style={{ marginTop: '10px' }}
      />
      <button onClick={handleUpload} style={{ marginTop: '10px' }}>
        Upload
      </button>
    </div>
  );
};

export default AdminUploadForm;
