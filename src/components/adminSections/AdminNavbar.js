import React, { useState, useEffect, useRef } from 'react';
import DarkModeToggle from '../DarkModeToggle';
import './AdminNavbar.css';

const AdminNavbar = ({ active, setActive, handleLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="admin-navbar">
      <div className="nav-left">
        <span className="brand">🛠 Admin Panel</span>
        <div className="nav-links">
          <button
            className={active === 'requests' ? 'active' : ''}
            onClick={() => setActive('requests')}
          >
            Requests
          </button>
          
          <button
            className={active === 'upload' ? 'active' : ''}
            onClick={() => setActive('upload')}
          >
            Upload Image
          </button>
          <button
            className={active === 'insights' ? 'active' : ''}
            onClick={() => setActive('insights')}
          >
            Insights
          </button>
          <button
            className={active === 'overview' ? 'active' : ''}
            onClick={() => setActive('overview')}
          >
            Overview
          </button>
        </div>
      </div>

      <div className="nav-right" ref={dropdownRef}>
        <button
          className="profile-icon"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          👤
        </button>
        <div className={`profile-dropdown ${dropdownOpen ? 'open' : ''}`}>
          <DarkModeToggle />
          <p onClick={handleLogout}>🚪 Logout</p>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
