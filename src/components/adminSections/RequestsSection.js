// src/components/adminSections/RequestsSection.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RequestRow from './requestSectionComponents/RequestRow';
import './requestSectionComponents/RequestsTable.css';
import './RequestsSection.css';
import Spinner from './Spinner';

const RequestsSection = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [handledRequests, setHandledRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/requests', {
        headers: {
          Authorization: token,
        },
      });

      const allRequests = res.data;

      // ✅ Sort both pending and handled by createdAt (newest first)
      const sortedPending = allRequests
        .filter((r) => r.status === 'pending')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const sortedHandled = allRequests
        .filter((r) => r.status !== 'pending')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setPendingRequests(sortedPending);
      setHandledRequests(sortedHandled);

      setLoading(false);
    } catch (err) {
      setError('Failed to fetch requests');
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="requests-container">
      <h2>Access Requests</h2>

      {loading ? (
        <Spinner />
      ) : error ? (

        <p className="error-text">{error}</p>
      ) : (
        <>
          {pendingRequests.length > 0 && (
            <div className="requests-table-wrapper">
              <h3 className="section-heading">🔴 Pending Requests</h3>
              <table className="requests-table pending">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Status</th>
                    <th>Requested At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRequests.map((request) => (
                    <RequestRow
                      key={request._id}
                      request={request}
                      onStatusChange={fetchRequests}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {handledRequests.length > 0 && (
            <div className="requests-table-wrapper">
              <h3 className="section-heading">📁 Request History</h3>
              <table className="requests-table history">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Status</th>
                    <th>Requested At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {handledRequests.map((request) => (
                    <RequestRow
                      key={request._id}
                      request={request}
                      onStatusChange={fetchRequests}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RequestsSection;
