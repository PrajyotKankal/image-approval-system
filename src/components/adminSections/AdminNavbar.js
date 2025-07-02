// src/components/adminSections/AdminNavbar.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import DarkModeToggle from '../DarkModeToggle';
import './AdminNavbar.css';

const AdminNavbar = ({ active, handleLogout }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navigate to main dashboard with a section state
  const goToSection = (section) => {
    navigate('/admin/dashboard', { state: { section } });
  };

  return (
    <nav className="admin-navbar">
      <div className="nav-left">
        <span className="brand">🛠 Admin Panel</span>
        <div className="nav-links">
          <button
            className={active === 'requests' ? 'active' : ''}
            onClick={() => goToSection('requests')}
          >
            Requests
          </button>
          <button
            className={active === 'upload' ? 'active' : ''}
            onClick={() => goToSection('upload')}
          >
            Upload Image
          </button>
          <button
            className={active === 'insights' ? 'active' : ''}
            onClick={() => goToSection('insights')}
          >
            Insights
          </button>
          <button
            className={active === 'overview' ? 'active' : ''}
            onClick={() => goToSection('overview')}
          >
            Overview
          </button>
        </div>
      </div>

      <div className="nav-right" ref={dropdownRef}>
        <button className="profile-icon" onClick={() => setDropdownOpen(!dropdownOpen)}>
          👤
        </button>
        <div className={`profile-dropdown ${dropdownOpen ? 'open' : ''}`}>
          <DarkModeToggle />
          {handleLogout && <p onClick={handleLogout}>🚪 Logout</p>}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
