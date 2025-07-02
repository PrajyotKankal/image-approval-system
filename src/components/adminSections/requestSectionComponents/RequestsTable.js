// src/components/admin/adminSections/RequestsTable.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RequestsTable.css';

const RequestsTable = ({ requests }) => {
  const navigate = useNavigate();

  return (
    <div className="requests-table-container">
      <h3>📋 Access Requests Table</h3>
      <table className="requests-table">
        <thead>
          <tr>
            <th>#</th>
            <th>User Email</th>
            <th>Status</th>
            <th>Requested At</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req, index) => (
            <tr key={req._id} className={`status-${req.status}`}>
              <td>{index + 1}</td>
              <td>{req.userEmail}</td>
              <td>
                <span className={`badge badge-${req.status}`}>{req.status}</span>
              </td>
              <td>{new Date(req.requestedAt).toLocaleString()}</td>
              <td>
                <button
                  className="view-btn"
                  onClick={() => navigate(`/admin/request/${req._id}`)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestsTable;
