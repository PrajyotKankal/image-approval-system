// src/components/adminSections/requestsectionComponent/RequestRow.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RequestRow.css';

const RequestRow = ({ request }) => {
  const navigate = useNavigate();

  if (!request) return null;

  const handleViewClick = () => {
    navigate(`/admin/requests/${request._id}`);
  };

  const formattedDate = request.createdAt
    ? new Date(request.createdAt).toLocaleString()
    : 'Not Available';

  return (
    <tr className={`request-row ${request.status}`}>
      <td>{request.userEmail}</td>
      <td>
        <span className={`status-pill status-${request.status}`}>
          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
        </span>
      </td>
      <td>{formattedDate}</td>
      <td>
        <button className="view-btn" onClick={handleViewClick}>
          View
        </button>
      </td>
    </tr>
  );
};

export default RequestRow;
