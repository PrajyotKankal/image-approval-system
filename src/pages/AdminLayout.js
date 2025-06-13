import React, { useState } from 'react';
import './AdminDashboard.css';
import Overview from './Overview';
import UploadImage from './UploadImage';
import AccessRequests from './AccessRequests';
import { useNavigate } from 'react-router-dom';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');

  const renderSection = () => {
    switch (activeSection) {
      case 'overview': return <Overview />;
      case 'upload': return <UploadImage />;
      case 'requests': return <AccessRequests />;
      default: return <Overview />;
    }
  };

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <h2 className="logo">🔧 Admin</h2>
        <nav>
          <button onClick={() => setActiveSection('overview')}>Overview</button>
          <button onClick={() => setActiveSection('upload')}>Upload Image</button>
          <button onClick={() => setActiveSection('requests')}>Access Requests</button>
          <button onClick={() => navigate('/user/dashboard')}>🔁 Switch to User</button>
          <button onClick={() => {
            localStorage.removeItem('admin-token');
            navigate('/admin/login');
          }}>🚪 Logout</button>
        </nav>
      </aside>

      <main className="main-content">
        {renderSection()}
      </main>
    </div>
  );
};

export default AdminLayout;
