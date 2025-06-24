// src/components/adminSections/RequestsSection.js
import React, { useState } from 'react';
import axios from 'axios';
import './RequestsSection.css';

const API_BASE = 'http://localhost:5000'; // Replace with your backend base URL

const RequestsSection = ({ requests, onApprove, onReject }) => {
  const [expandedId, setExpandedId] = useState(null);

  const toggleDropdown = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const renderRequestCard = (req) => {
    const isExpanded = expandedId === req._id;

    return (
      <div key={req._id} className={`request-card ${isExpanded ? 'expanded' : ''}`}> 
        <div className="dropdown-toggle" onClick={() => toggleDropdown(req._id)}>
          <span role="img" aria-label="user-icon">📄</span> {req.userEmail} ▼
        </div>

        {isExpanded && (
          <div className="dropdown-content">
            <p><strong>Status:</strong> <span className={`badge ${req.status}`}>{req.status}</span></p>
            <p><strong>Date:</strong> {new Date(req.requestedAt).toLocaleString()}</p>

            <div className="request-images">
              {req.images.map((img, i) => (
                <img
                  key={i}
                  src={`${API_BASE}${img.path}`}
                  alt={img.filename}
                  className="request-img"
                />
              ))}
            </div>

            {req.status === 'pending' && (
              <div className="btn-group">
                <button className="btn btn-approve" onClick={() => onApprove(req._id)}>✅ Approve</button>
                <button className="btn btn-reject" onClick={() => onReject(req._id)}>❌ Reject</button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const pending = requests.filter(r => r.status === 'pending');
  const handled = requests.filter(r => r.status !== 'pending');

  return (
    <div className="requests-section">
      <h4>📷 <span>Image Access Requests</span></h4>

      <h5>💡 New Requests (Pending)</h5>
      <div className="request-grid">
        {pending.map(renderRequestCard)}
      </div>

      <h5>📁 Handled Requests</h5>
      <div className="request-grid">
        {handled.map(renderRequestCard)}
      </div>
    </div>
  );
};

export default RequestsSection;