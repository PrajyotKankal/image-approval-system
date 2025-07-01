// src/components/adminSections/RequestsSection.js
import React, { useState } from 'react';
import './RequestsSection.css';

const API_BASE = 'http://localhost:5000'; // Replace with your backend base URL

const RequestsSection = ({ requests, onApprove, onReject }) => {
  const [expandedId, setExpandedId] = useState(null);

  const toggleDropdown = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const renderRequestCard = (req) => {
    const isExpanded = expandedId === req._id;
    const isHandled = req.status !== 'pending';

    return (
      <div
        key={req._id}
        className={`request-card ${isExpanded ? 'open' : ''} ${isHandled ? 'handled' : ''}`}
      >
        <div className="dropdown-header" onClick={() => toggleDropdown(req._id)}>
          <span className="user-icon">👤</span>
          {req.userEmail}
          <span className="arrow">{isExpanded ? '▲' : '▼'}</span>
        </div>

        <div className="dropdown-body">
  <p>
    <strong>Status:</strong>{' '}
    <span className={`badge badge-${req.status}`}>{req.status}</span>
  </p>

  <p>
    <strong>Requested on:</strong>{' '}
    {new Date(req.requestedAt).toLocaleString()}
  </p>

 

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
      <button className="btn-approve" onClick={() => onApprove(req._id)}>
        Approve
      </button>
      <button className="btn-reject" onClick={() => onReject(req._id)}>
        Reject
      </button>
    </div>
  )}
</div>

      </div>
    );
  };

  const pending = requests.filter((r) => r.status === 'pending');
  const handled = requests.filter((r) => r.status !== 'pending');

  return (
    <div className="requests-section">
      <h3>📂 Image Access Requests</h3>

      <h5>🕓 Pending Requests</h5>
      {pending.length ? (
        <div className="request-grid">
          {pending.map(renderRequestCard)}
        </div>
      ) : (
        <p className="faint">No new requests to review.</p>
      )}

      <h5 className="handled-header">✅ Handled Requests</h5>
      {handled.length ? (
        <div className="request-grid">
          {handled.map(renderRequestCard)}
        </div>
      ) : (
        <p className="faint">No handled requests yet.</p>
      )}
    </div>
  );
};

export default RequestsSection;
