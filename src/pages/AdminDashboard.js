// 📦 React and React Router
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// 📊 Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,         // ✅ Add this
  Title,
  Tooltip,
  Legend
} from 'chart.js';



import { Line, Bar } from 'react-chartjs-2';


// 🧩 External Libraries
import axios from 'axios';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';

// 🎨 Local CSS
import './AdminDashboard.css';

// ✅ Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,         // ✅ Register this too
  Title,
  Tooltip,
  Legend
);


const API_BASE = 'http://localhost:5000';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('admin-token');
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '' });

  const [analytics, setAnalytics] = useState({ users: 0, admins: 0, logs: [] });


  const [showUsers, setShowUsers] = useState(false);
  const [showAdmins, setShowAdmins] = useState(false);

  const [active, setActive] = useState('overview');
  const [requests, setRequests] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [tags, setTags] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [filterTag, setFilterTag] = useState('');

  const [chartType, setChartType] = useState('line'); // 'line' or 'bar'
  const [filterMode, setFilterMode] = useState('month'); // 'day' or 'month'


  // Fetch all image access requests
  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/requests`);
      setRequests(res.data || []);
    } catch {
      toast.error('Failed to fetch requests');
    }
  };




  // Upload image to backend
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


  // Handle status change on requests
  const handleAction = async (id, status) => {
    const admin = localStorage.getItem('admin-name') || 'Unknown'; // Add this line

    try {
      await axios.put(
        `${API_BASE}/api/requests/${id}`,
        { status, approvedBy: admin },  // ✅ send admin name explicitly
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Marked as ${status}`);
      fetchRequests();
    } catch {
      toast.error('Action failed');
    }
  };

  // const handleFileChange = (e) => setSelectedFiles(Array.from(e.target.files));


  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout as Admin?")) {
      localStorage.removeItem('admin-token');
      toast.info('Switched to User Mode');
      navigate('/user/dashboard'); // ✅ Go to User Dashboard
    }
  };




  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/admins/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnalytics(res.data);
    } catch (err) {
      toast.error('Failed to fetch analytics');
    }
  }, [token]);

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



  useEffect(() => {
    fetchRequests();
    fetchUploadedImages();
    fetchAnalytics();
  }, [fetchAnalytics, fetchUploadedImages]);

  const renderOverview = () => {
    const total = requests.length;
    const approved = requests.filter(r => r.status === 'approved').length;
    const rejected = requests.filter(r => r.status === 'rejected').length;
    const pending = total - approved - rejected;

    const todayCount = requests.filter(
      req => new Date(req.requestedAt).toDateString() === new Date().toDateString()
    ).length;

    const uploadedCount = uploadedImages.length;

    const getFilteredData = () => {
      const counts = {};
      requests.forEach(req => {
        const date = new Date(req.requestedAt);
        let key = '';

        if (filterMode === 'day') {
          key = date.toLocaleDateString(); // e.g., "6/10/2025"
        } else {
          key = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`; // e.g., "Jun 2025"
        }

        counts[key] = (counts[key] || 0) + 1;
      });

      const labels = Object.keys(counts).sort((a, b) => new Date(a) - new Date(b));
      const values = labels.map(label => counts[label]);

      return { labels, values };
    };

    const { labels, values } = getFilteredData();

    const chartData = {
      labels,
      datasets: [
        {
          label: 'Request Volume',
          data: values,
          fill: true,
          backgroundColor: 'rgba(13, 110, 253, 0.2)',
          borderColor: 'rgba(13, 110, 253, 1)',
          tension: 0.4,
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      plugins: {
        legend: { display: true },
        title: {
          display: true,
          text: `Requests by ${filterMode === 'day' ? 'Day' : 'Month'}`,
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1 },
        },
      },
    };

    const ChartComponent = chartType === 'bar' ? Bar : Line;

    const stats = [
      { label: 'Total Requests', value: total, icon: 'bi-envelope-paper', color: 'blue', note: 'All Time' },
      { label: 'Pending', value: pending, icon: 'bi-hourglass-split', color: 'yellow', note: 'Awaiting Review' },
      { label: 'Approved', value: approved, icon: 'bi-check-circle', color: 'green', note: 'Accepted' },
      { label: 'Rejected', value: rejected, icon: 'bi-x-circle', color: 'red', note: 'Declined' },
    ];

    const tagCountMap = {};
    uploadedImages.forEach(img => {
      img.tags.forEach(tag => {
        tagCountMap[tag] = (tagCountMap[tag] || 0) + 1;
      });
    });
    const sortedTags = Object.entries(tagCountMap).sort((a, b) => b[1] - a[1]);

    const handleDownloadExcelReport = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/requests/export`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
        console.error(error);
      }
    };




    return (
      <div className="container-fluid animate__animated animate__fadeIn">
        {/* Stats */}
        <div className="stats-cards mb-4">
          {stats.map((item, idx) => (
            <div className={`stat-box ${item.color}`} key={idx}>
              <i className={`bi ${item.icon} fs-3 mb-2 text-${item.color}`}></i>
              <h5>{item.label}</h5>
              <p>{item.value}</p>
              <small className="text-muted">{item.note}</small>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="row g-4">
          <div className="col-md-6">
            <div className="section">
              <h6 className="section-subtitle">📅 Request Summary</h6>
              <p><strong>New Requests Today:</strong> {todayCount}</p>
              <p><strong>Total Uploaded Images:</strong> {uploadedCount}</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="section">
              <h6 className="section-subtitle">🕒 Recent Activity</h6>
              {requests.length === 0 ? (
                <p className="text-muted">No recent activity found.</p>
              ) : (
                <ul className="recent-activity">
                  {requests.slice(0, 3).map((r, i) => (
                    <li key={i}>
                      <strong>{r.userEmail}</strong> → {r.status}
                      <span className="text-muted ms-2">
                        ({new Date(r.requestedAt).toLocaleDateString()})
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Controls + Chart and Tag Summary Side by Side */}
        <div className="row mt-4">
          {/* Left: Tag Summary */}
          <div className="col-md-6 mb-3">
            <div className="section h-100">
              <h6 className="section-subtitle">🏷️ Tag Usage Summary</h6>
              {sortedTags.length === 0 ? (
                <p className="text-muted">No tags found in uploaded images.</p>
              ) : (
                <ul className="list-group">
                  {sortedTags.map(([tag, count], i) => (
                    <li
                      key={i}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <span className="badge bg-primary px-3 py-2 text-uppercase">{tag}</span>
                      <span className="badge bg-secondary">{count} image{count > 1 ? 's' : ''}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Right: Dropdowns + Chart */}
          <div className="col-md-6 mb-3">
            {/* Dropdowns */}
            <div className="d-flex gap-2 justify-content-end mb-3">
              <select
                className="form-select w-auto"
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
              >
                <option value="line">📈 Line Chart</option>
                <option value="bar">📊 Bar Chart</option>
              </select>
              <select
                className="form-select w-auto"
                value={filterMode}
                onChange={(e) => setFilterMode(e.target.value)}
              >
                <option value="month">By Month</option>
                <option value="day">By Day</option>

              </select>
              <button
                className="btn btn-outline-success"
                onClick={handleDownloadExcelReport}
              >
                📥 Download Excel Report
              </button>


            </div>

            {/* Chart */}
            <div className="card border-0 shadow-sm p-3 h-100">
              <ChartComponent data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>


      </div>
    );
  };



const renderInsightsSection = () => {
  const handleCreateAdmin = async () => {
    if (!newAdmin.username || !newAdmin.password) {
      return toast.warn('All fields are required');
    }

    try {
      await axios.post(`${API_BASE}/api/admins/add`, newAdmin);
      toast.success('New admin created!');
      setNewAdmin({ username: '', password: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add admin');
    }
  };

  return (
    <div className="container-fluid px-4 mt-2">
      <h4 className="fw-bold text-dark mb-4">📊 Insights</h4>

      {/* ✅ User and Admin Stats */}
<div className="row g-4 mb-4">
  {/* Users */}
  <div className="col-md-6">
    <div className="card shadow-sm p-4">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="fw-bold mb-0">
          👥 Total Registered Users
          <span className="badge bg-primary ms-2">{analytics.users?.length || 0}</span>
        </h5>
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={() => setShowUsers(!showUsers)}
        >
          {showUsers ? '▲' : '▼'}
        </button>
      </div>
      {showUsers && (
        <ul className="list-group mt-3">
          {analytics.users.map((user, i) => (
            <li key={i} className="list-group-item">📧 {user.email}</li>
          ))}
        </ul>
      )}
    </div>
  </div>

  {/* Admins */}
  <div className="col-md-6">
    <div className="card shadow-sm p-4">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="fw-bold mb-0">
          🧑‍💼 Total Registered Admins
          <span className="badge bg-dark ms-2">{analytics.admins?.length || 0}</span>
        </h5>
        <button
          className="btn btn-sm btn-outline-dark"
          onClick={() => setShowAdmins(!showAdmins)}
        >
          {showAdmins ? '▲' : '▼'}
        </button>
      </div>
      {showAdmins && (
        <ul className="list-group mt-3">
          {analytics.admins.map((admin, i) => (
            <li key={i} className="list-group-item">🛡 {admin.username}</li>
          ))}
        </ul>
      )}
    </div>
  </div>
</div>

     
      {/* ✅ Add New Admin - full width like above cards */}
      <div className="row">
        <div className="col-md-12">
          <div className="card shadow-sm p-4 rounded-4">
            <h5 className="mb-3 fw-bold">➕ Add New Admin</h5>
            <div className="row g-2">
              <div className="col-md-5">
                <input
                  type="text"
                  className="form-control rounded-pill"
                  placeholder="Admin Username"
                  value={newAdmin.username}
                  onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                />
              </div>
              <div className="col-md-5">
                <input
                  type="password"
                  className="form-control rounded-pill"
                  placeholder="Password"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                />
              </div>
              <div className="col-md-2">
                <button
                  className="btn btn-success rounded-pill w-100"
                  onClick={handleCreateAdmin}
                >
                  ✅
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};




  const renderUploadSection = () => {
    const filtered = uploadedImages.filter(img =>
      filterTag === '' || img.tags.some(tag => tag.toLowerCase().includes(filterTag.toLowerCase()))
    );

    return (


      <div className="container-fluid my-5 px-4">
        {/* Upload Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="bg-white border rounded-4 shadow p-4">
              <h4 className="mb-4 fw-bold text-dark">📤 Upload New Images</h4>
              <div className="row g-3 align-items-center">
                <div className="col-md-5">
                  <input
                    type="file"
                    className="form-control rounded-pill"
                    multiple
                    onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
                  />
                </div>
                <div className="col-md-5">
                  <input
                    type="text"
                    placeholder="Enter tags (comma-separated)"
                    className="form-control rounded-pill"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>
                <div className="col-md-2 text-end">
                  <button className="btn btn-primary w-100 rounded-pill" onClick={uploadImage}>
                    🚀 Upload
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>





        {/* Gallery */}
        <div className="bg-white border rounded-4 shadow p-4">
          <h4 className="mb-3 fw-bold text-dark">🖼 Uploaded Gallery</h4>

          <div className="mb-4">
            <input
              type="text"
              placeholder="🔍 Filter by tag..."
              className="form-control rounded-pill"
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
            />
          </div>

          <div className="row g-4">
            {filtered.length === 0 ? (
              <p className="text-muted text-center">No images found.</p>
            ) : (
              filtered.map((img, idx) => (
                <div key={idx} className="col-md-4">
                  <div
                    className="card border-0 shadow-sm h-100 rounded-4 overflow-hidden"
                    style={{ cursor: 'pointer', transition: 'transform 0.3s ease' }}
                    onClick={() => setFullscreenImage(`${API_BASE}${img.path}`)}
                  >
                    <img src={`${API_BASE}${img.path}`} className="card-img-top" alt={img.filename} />
                    <div className="card-body">
                      <h6 className="fw-semibold text-dark text-truncate">{img.filename}</h6>
                      <div className="mb-2">
                        {img.tags.map((tag, i) => (
                          <span key={i} className="badge bg-secondary-subtle text-dark me-1">{tag}</span>
                        ))}
                      </div>

                      {/* Buttons row */}
                      <div className="d-flex gap-2">
                        {/* Edit Tags */}
                        <button
                          className="btn btn-sm btn-outline-warning rounded-pill"
                          onClick={(e) => {
                            e.stopPropagation();
                            const newTags = prompt('Enter new tags (comma-separated):');
                            if (newTags) {
                              axios
                                .put(`${API_BASE}/api/images/update-tags/${img._id}`, { tags: newTags }, {
                                  headers: { Authorization: `Bearer ${token}` }
                                })
                                .then(() => {
                                  toast.success('Tags updated!');
                                  fetchUploadedImages();
                                })
                                .catch(() => toast.error('Failed to update tags'));
                            }
                          }}
                        >
                          ✏️ Edit Tags
                        </button>

                        {/* Delete Image */}
                        <button
                          className="btn btn-sm btn-outline-danger rounded-pill"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Are you sure you want to delete this image?')) {
                              axios
                                .delete(`${API_BASE}/api/images/${img._id}`, {
                                  headers: { Authorization: `Bearer ${token}` }
                                })
                                .then(() => {
                                  toast.success('Image deleted!');
                                  fetchUploadedImages();
                                })
                                .catch(() => toast.error('Failed to delete image'));
                            }
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Fullscreen Image Modal */}
        {fullscreenImage && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center"
            style={{ zIndex: 1055 }}
            onClick={() => setFullscreenImage(null)}
          >
            <div className="position-relative">
              <img src={fullscreenImage} alt="Fullscreen" className="img-fluid rounded-3" style={{ maxHeight: '90vh' }} />
              <button
                className="btn btn-light position-absolute top-0 end-0 m-3"
                onClick={() => setFullscreenImage(null)}
              >
                ✖
              </button>
            </div>
          </div>
        )}
      </div>



    );
  };




  const renderRequestsSection = () => {
    const today = new Date().toDateString();

    const isToday = (date) => new Date(date).toDateString() === today;

    const newRequests = requests.filter(req => isToday(req.requestedAt));
    const oldRequests = requests.filter(req => !isToday(req.requestedAt));

    const renderCard = (req) => (
      <div key={req._id} className="request-card">
        <p><strong>User:</strong> {req.userEmail}</p>
        <p><strong>Status:</strong> {req.status}</p>
        <p><strong>Date:</strong> {new Date(req.requestedAt).toLocaleString()}</p>

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
          <div className="btn-group mt-2">
            <button
              className="btn btn-success btn-sm me-2"
              onClick={() => handleAction(req._id, 'approved')}
            >
              Approve
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleAction(req._id, 'rejected')}
            >
              Reject
            </button>
          </div>
        )}
      </div>
    );

    return (
      <div className="container my-5 px-3">
        <div className="bg-white border rounded-4 shadow p-4">
          <h4 className="fw-bold text-dark mb-4">📩 Image Access Requests</h4>

          {/* New Requests */}
          {newRequests.length > 0 && (
            <>
              <h5 className="text-primary fw-semibold mb-3 border-bottom pb-2">🆕 New Requests</h5>
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {newRequests.map(renderCard)}
              </div>
            </>
          )}

          {/* Older Requests */}
          {oldRequests.length > 0 && (
            <>
              <h5 className="text-secondary fw-semibold mt-5 mb-3 border-bottom pb-2">📁 Older Requests</h5>
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {oldRequests.map(renderCard)}
              </div>
            </>
          )}

          {/* No Requests */}
          {newRequests.length === 0 && oldRequests.length === 0 && (
            <div className="alert alert-light border text-center mt-4">
              No image requests found.
            </div>
          )}
        </div>
      </div>


    );
  };


  return (
    <div className="admin-dashboard-container d-flex">
      {/* Sidebar */}
      <div className="sidebar bg-white border-end shadow-sm p-4" style={{ width: '220px', minHeight: '100vh' }}>
        <h4 className="fw-bold text-primary text-center mb-4">🛠 Admin</h4>
        <div className="d-grid gap-2">
          <button className={`btn ${active === 'overview' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActive('overview')}>Overview</button>
          <button className={`btn ${active === 'upload' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActive('upload')}>Upload Image</button>
          <button className={`btn ${active === 'requests' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActive('requests')}>Image Requests</button>
          <button className={`btn ${active === 'insights' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActive('insights')}>Insights</button>
          <hr />
          <button className="btn btn-outline-danger" onClick={handleLogout}>🚪 Act as User</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content flex-grow-1 p-4 bg-light" style={{ minHeight: '100vh', overflowY: 'auto' }}>
        {active === 'overview' && renderOverview()}
        {active === 'upload' && renderUploadSection()}
        {active === 'requests' && renderRequestsSection()}
        {active === 'insights' && renderInsightsSection()}
      </div>
    </div>

  );
};

export default AdminDashboard;
