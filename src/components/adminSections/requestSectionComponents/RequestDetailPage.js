// src/pages/admin/RequestDetailPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import './RequestDetailPage.css';
import AdminNavbar from '../AdminNavbar';

const RequestDetailPage = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [active, setActive] = useState('requests');
  const [request, setRequest] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequestAndHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const reqRes = await axios.get(`http://localhost:5000/api/requests/${requestId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setRequest(reqRes.data);

        const histRes = await axios.get(`http://localhost:5000/api/requests/history/${reqRes.data.userEmail}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setHistory(histRes.data);
      } catch (err) {
        console.error("Failed to fetch request or history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestAndHistory();
  }, [requestId]);

  const handleStatusUpdate = async (status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/requests/${requestId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      navigate('/admin/dashboard');
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const renderImages = () => (
    <ul className="image-list">
      {request.images.map((img, idx) => (
        <li key={idx}>
          <img
            src={`http://localhost:5000/uploads/${img.filename}`}
            alt={img.filename}
            className="preview-image"
          />
        </li>
      ))}
    </ul>
  );

  const renderActionButtons = () => (
    <div className="action-buttons">
      <button className="approve-btn" onClick={() => handleStatusUpdate('approved')}>
        Approve
      </button>
      <button className="reject-btn" onClick={() => handleStatusUpdate('rejected')}>
        Reject
      </button>
    </div>
  );

  const renderHistory = () => (
    <div className="request-history">
      <h3>User's Past Requests</h3>
      <table className="history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Status</th>
            <th>Images</th>
          </tr>
        </thead>
        <tbody>
          {history.map((item, index) => (
            <tr key={index}>
              <td>{moment(item.createdAt).format('YYYY-MM-DD HH:mm')}</td>
              <td>{item.status}</td>
              <td>
                <ul>
                  {item.images.map((img, i) => (
                    <li key={i}>{img.filename}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (loading) return <div className="loading">Loading...</div>;
  if (!request) return <div className="error">Request not found.</div>;

  return (
    <>
      <AdminNavbar active={active} setActive={setActive} handleLogout={handleLogout} />

      <div className="request-detail">
        <h2>Request Details</h2>

        <div className="detail-info">
          <p><strong>User:</strong> {request.userEmail}</p>
          <p><strong>Status:</strong> {request.status}</p>
          <p><strong>Images Requested:</strong> {request.images.length}</p>
        </div>

        {renderImages()}

        {request.status === 'pending' && renderActionButtons()}

        {history.length > 0 && renderHistory()}
      </div>
    </>
  );
};

export default RequestDetailPage;
