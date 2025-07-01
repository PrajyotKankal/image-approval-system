import React from 'react';
import './InsightsSection.css';

const InsightsSection = ({
  analytics,
  newAdmin,
  setNewAdmin,
  showUsers,
  setShowUsers,
  showAdmins,
  setShowAdmins,
  handleCreateAdmin,
  handleDeleteUser
}) => {

  const confirmDelete = (userId, email) => {
    const confirm = window.confirm(`Are you sure you want to delete user: ${email}?`);
    if (confirm) {
      handleDeleteUser(userId);
    }
  };

  return (
    <div className="insights-wrapper">
      <h2 className="insights-title">Insights</h2>

      <div className="insights-grid">
        {/* Users */}
        <div className="insights-card">
          <div className="insights-header">
            <h3>
              👥 Total Registered Users
              <span className="badge blue">{analytics.users?.length || 0}</span>
            </h3>
            <button className="toggle-btn" onClick={() => setShowUsers(!showUsers)}>
              {showUsers ? '▲' : '▼'}
            </button>
          </div>
          {showUsers && (
            <ul className="list-group">
              {analytics.users.map((user, i) => (
                <li key={i} className="user-list-item">
                  📧 {user.email}
                  <button
                    className="delete-btn"
                    onClick={() => confirmDelete(user._id, user.email)}
                    title="Delete User"
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div></div><div>

        {/* Admins */}
        <div className="insights-card">
          <div className="insights-header">
            <h3>
              🧑‍💼 Total Registered Admins
              <span className="badge black">{analytics.admins?.length || 0}</span>
            </h3>
            <button className="toggle-btn" onClick={() => setShowAdmins(!showAdmins)}>
              {showAdmins ? '▲' : '▼'}
            </button>
          </div>
          {showAdmins && (
            <ul className="list-group">
              {analytics.admins.map((admin, i) => (
                <li key={i}>🛡 {admin.username}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Add Admin */}
      <div className="add-admin-card">
        <h3>➕ Add New Admin</h3>
        <div className="add-admin-form">
          <input
            type="text"
            placeholder="Admin Username"
            value={newAdmin.username}
            onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={newAdmin.password}
            onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
          />
          <button className="create-btn" onClick={handleCreateAdmin}>✅</button>
        </div>
      </div>
    </div>
  );
};

export default InsightsSection;
