// src/pages/AdminDashboard.js
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // ✅ Add useLocation

import axios from 'axios';
import { toast } from 'react-toastify';

// ✅ Components
import AdminNavbar from '../components/adminSections/AdminNavbar';
import OverviewSection from '../components/adminSections/OverviewSection';
import UploadSection from '../components/adminSections/UploadSection';
import RequestsSection from '../components/adminSections/RequestsSection';
import InsightsSection from '../components/adminSections/InsightsSection';

// ✅ Charts
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler // ✅ Import this!

} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler // ✅ Import this!

);

const API_BASE = 'http://localhost:5000';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');


  // State
  const [active, setActive] = useState('requests');
  const [requests, setRequests] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [tags, setTags] = useState('');
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [filterTag, setFilterTag] = useState('');

  const [chartType, setChartType] = useState('line');
  const [filterMode, setFilterMode] = useState('month');

  const [analytics, setAnalytics] = useState({ users: [], admins: [], logs: [] });
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '' });
  const [showUsers, setShowUsers] = useState(false);
  const [showAdmins, setShowAdmins] = useState(false);

  const location = useLocation();
const section = location.state?.section;

useEffect(() => {
  if (section) {
    setActive(section); // ✅ Load section from URL
  }
}, [section]);

  // API Calls
  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/requests`);
      setRequests(res.data || []);
    } catch {
      toast.error('Failed to fetch requests');
    }
  };

  const fetchUploadedImages = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/images`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUploadedImages(res.data || []);
    } catch {
      toast.error('Failed to load uploaded images');
    }
  }, [token]);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/admins/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnalytics(res.data);
    } catch {
      toast.error('Failed to fetch analytics');
    }
  }, [token]);

  useEffect(() => {
    fetchRequests();
    fetchUploadedImages();
    fetchAnalytics();
  }, [fetchAnalytics, fetchUploadedImages]);

  // Upload
  const uploadImage = async () => {
    if (!selectedFiles.length) return toast.warn('Please select images');
    const formData = new FormData();
    selectedFiles.forEach(file => formData.append('images', file));
    formData.append('tags', tags);

    try {
      await axios.post(`${API_BASE}/api/images/upload`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Images uploaded successfully');
      setSelectedFiles([]);
      setTags('');
      fetchUploadedImages();
    } catch {
      toast.error('Upload failed');
    }
  };


const handleDeleteUser = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:5000/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Optionally refresh user list here
  } catch (err) {
    console.error("Failed to delete user:", err);
    alert("Unauthorized or token missing");
  }
};




  // Handle request actions
  const handleAction = async (id, status) => {
    const admin = localStorage.getItem('admin-name') || 'Unknown';
    try {
      await axios.put(
        `${API_BASE}/api/requests/${id}`,
        { status, approvedBy: admin },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Marked as ${status}`);
      fetchRequests();
    } catch {
      toast.error('Action failed');
    }
  };

  // Create admin
  const handleCreateAdmin = async () => {
    if (!newAdmin.username || !newAdmin.password) {
      return toast.warn('All fields are required');
    }
    try {
      await axios.post(`${API_BASE}/api/admins/add`, newAdmin);
      toast.success('New admin created!');
      setNewAdmin({ username: '', password: '' });
      fetchAnalytics();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add admin');
    }
  };

  // Logout
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout as Admin?')) {
      localStorage.removeItem('admin-token');
      toast.info('Switched to User Mode');
      navigate('/user/dashboard');
    }
  };

  // Excel Download
  const handleDownloadExcelReport = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/requests/export`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to download');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'approvals_report.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error('❌ Could not download Excel report');
    }
  };

  return (
    <div className="admin-dashboard-container">
      {/* Top Navbar */}
      <AdminNavbar active={active} setActive={setActive} handleLogout={handleLogout} />

      {/* Main Content */}
      <div className="main-content p-4 bg-light" style={{ minHeight: '100vh', overflowY: 'auto' }}>
        {active === 'overview' && (
          <OverviewSection
            requests={requests}
            uploadedImages={uploadedImages}
            chartType={chartType}
            setChartType={setChartType}
            filterMode={filterMode}
            setFilterMode={setFilterMode}
            handleDownloadExcelReport={handleDownloadExcelReport}
          />
        )}

        {active === 'upload' && (
          <UploadSection
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            tags={tags}
            setTags={setTags}
            token={token}
            uploadImage={uploadImage}
            uploadedImages={uploadedImages}
            fetchUploadedImages={fetchUploadedImages}
            fullscreenImage={fullscreenImage}
            setFullscreenImage={setFullscreenImage}
            filterTag={filterTag}
            setFilterTag={setFilterTag}
          />
        )}

        {active === 'requests' && (
          <RequestsSection
            requests={requests}
            onApprove={(id) => handleAction(id, 'approved')}
            onReject={(id) => handleAction(id, 'rejected')}
          />
        )}

        {active === 'insights' && (
          <InsightsSection
            analytics={analytics}
            newAdmin={newAdmin}
            setNewAdmin={setNewAdmin}
            showUsers={showUsers}
            setShowUsers={setShowUsers}
            showAdmins={showAdmins}
            setShowAdmins={setShowAdmins}
            handleCreateAdmin={handleCreateAdmin}
            handleDeleteUser={handleDeleteUser} // ✅ add this
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
