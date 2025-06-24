import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './UploadSection.css';

const API_BASE = 'http://localhost:5000';

const UploadSection = () => {
    const [images, setImages] = useState([]);
    const [tagFilter, setTagFilter] = useState('');
    const [selectedFiles, setSelectedFiles] = useState(null);
    const [tags, setTags] = useState('');
    const [fullscreenImage, setFullscreenImage] = useState(null);

    const fetchImages = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/images`);
            setImages(res.data);
        } catch (err) {
            toast.error('Failed to fetch images');
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const handleUpload = async () => {
        if (!selectedFiles || !tags) return toast.warn('Select files and tags');

        const formData = new FormData();
        Array.from(selectedFiles).forEach(file => formData.append('images', file));
        formData.append('tags', tags);

        try {
            await axios.post(`${API_BASE}/api/images/upload`, formData);
            toast.success('Uploaded successfully');
            setSelectedFiles(null);
            setTags('');
            fetchImages();
        } catch (err) {
            toast.error('Upload failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this image?')) return;
        try {
            await axios.delete(`${API_BASE}/api/images/${id}`);
            toast.success('Image deleted');
            fetchImages();
        } catch {
            toast.error('Delete failed');
        }
    };

    const handleEditTags = async (id) => {
    const image = images.find(img => img._id === id);
    const currentTags = image?.tags || [];
    const newTags = prompt('Enter new tags to add (comma-separated):');
    if (!newTags) return;

    const additionalTags = newTags.split(',').map(t => t.trim()).filter(Boolean);
    const mergedTags = [...new Set([...currentTags, ...additionalTags])]; // avoid duplicates

    try {
        await axios.put(`${API_BASE}/api/images/update-tags/${id}`, { tags: mergedTags });
        toast.success('Tags updated');
        fetchImages();
    } catch {
        toast.error('Failed to update tags');
    }
};

    const filtered = tagFilter
        ? images.filter(img => img.tags.some(tag => tag.includes(tagFilter)))
        : images;

    return (
        <div className="upload-wrapper">
            <div className="upload-card">
                <h3>📤 Upload New Images</h3>
                <input
                    type="file"
                    multiple
                    onChange={e => setSelectedFiles(e.target.files)}
                />
                <input
                    type="text"
                    placeholder="Enter tags (comma-separated)"
                    value={tags}
                    onChange={e => setTags(e.target.value)}
                />
                <button onClick={handleUpload}>🚀 Upload</button>
            </div>

            <div className="upload-card">
                <h3>🖼️ Uploaded Gallery</h3>
                <input
                    type="text"
                    placeholder="🔍 Filter by tag..."
                    value={tagFilter}
                    onChange={e => setTagFilter(e.target.value)}
                />

                <div className="image-gallery">
                    {filtered.map((img, idx) => (
                        <div className="image-card" key={idx}>
                            <img
                                src={`${API_BASE}${img.path}`}
                                alt={img.filename}
                                onClick={() => setFullscreenImage(`${API_BASE}${img.path}`)}
                            />

                            <div className="tag-overlay">
                                {img.tags && img.tags.map((tag, i) => (
                                    <span className="tag-pill" key={i}>#{tag}</span>
                                ))}
                            </div>

                            <div className="image-actions">
                                <button onClick={() => handleEditTags(img._id)}>✏️</button>
                                <button onClick={() => handleDelete(img._id)}>🗑️</button>
                            </div>
                        </div>

                    ))}
                </div>
            </div>

            {fullscreenImage && (
                <div className="fullscreen-overlay" onClick={() => setFullscreenImage(null)}>
                    <img src={fullscreenImage} alt="Fullscreen" className="fullscreen-img" />
                </div>
            )}
        </div>
    );
};

export default UploadSection;
