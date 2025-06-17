import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ImageSearch from '../components/imageSearch/ImageSearch';
import { useCart } from '../components/context/ContextCart';
import axios from 'axios';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import DarkModeToggle from '../components/DarkModeToggle';
import './UserDashboard.css';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [showApprovedDropdown, setShowApprovedDropdown] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const { cartItems, removeFromCart, requestImages } = useCart();
  const [approvedImages, setApprovedImages] = useState([]);
  const [searchStarted, setSearchStarted] = useState(false);
  const [downloadedOnce, setDownloadedOnce] = useState(false);
  const [downloadedIds, setDownloadedIds] = useState([]);
  const [downloadedMeta, setDownloadedMeta] = useState([]);

  const API_BASE = 'http://localhost:5000';

  const fetchApprovedImages = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const decoded = JSON.parse(atob(token.split('.')[1]));
      const email = decoded.email;

      const res = await axios.get(`${API_BASE}/api/requests`);
      const filtered = res.data.filter(req => req.userEmail === email && req.status === 'approved');
      const approved = filtered.flatMap(req => req.images);
      setApprovedImages(approved);

      const downloadedData = JSON.parse(localStorage.getItem('downloadedApprovedImages')) || [];
      const ids = downloadedData.map(entry => entry.id);
      const allDownloaded = approved.every(img => ids.includes(img._id || img.asset_id));

      setDownloadedOnce(allDownloaded);
      setDownloadedIds(ids);
    } catch (err) {
      toast.error('Failed to load approved images');
    }
  }, []);

  useEffect(() => {
    fetchApprovedImages();
  }, [fetchApprovedImages]);

  useEffect(() => {
    const meta = JSON.parse(localStorage.getItem('downloadedApprovedImages')) || [];
    setDownloadedMeta(meta);
  }, [approvedImages]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUserRole(decoded.role);
      } catch (err) {
        console.error('Invalid token format');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.info('Logged out');
    navigate('/login');
  };

  const handleRequestImages = () => {
    requestImages();
    setShowCartDropdown(false);
  };

  const downloadAllAsZip = async () => {
    if (approvedImages.length === 0) return toast.warn('No approved images to download');

    const downloadedData = JSON.parse(localStorage.getItem('downloadedApprovedImages')) || [];
    const existingIds = downloadedData.map(entry => entry.id);

    const newImages = approvedImages.filter(img => !existingIds.includes(img._id || img.asset_id));
    if (newImages.length === 0) return toast.info('No new approved images to download');

    const zip = new JSZip();
    const folder = zip.folder('approved-images');

    try {
      await Promise.all(
        newImages.map(async (img, i) => {
          const response = await fetch(`${API_BASE}${img.path}`);
          const blob = await response.blob();
          const filename = img.filename || `image-${i + 1}.jpg`;
          folder.file(filename, blob);
        })
      );

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'approved-images.zip');

      const now = new Date().toISOString();
      const newDownloadedData = newImages.map(img => ({
        id: img._id || img.asset_id,
        filename: img.filename,
        date: now,
      }));

      const updated = [...downloadedData, ...newDownloadedData];
      localStorage.setItem('downloadedApprovedImages', JSON.stringify(updated));

      setDownloadedOnce(true);
      setShowApprovedDropdown(false);
      toast.success('New approved images downloaded');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate ZIP');
    }
  };

  const newApproved = approvedImages.filter(img => !downloadedIds.includes(img._id || img.asset_id));
  const historyApproved = approvedImages.filter(img => downloadedIds.includes(img._id || img.asset_id));

  return (
    <div className="dashboard">
      {/* Header */}
      <div className={`dashboard-header ${searchStarted ? 'pinned' : ''}`}>
        <div className="logo">Imagle</div>

        <div className="header-actions">
          {/* Cart */}
          <div className="dropdown">
            <button className="btn blue cart-btn" onClick={() => setShowCartDropdown(!showCartDropdown)}>
              🛒 Your Cart
              {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
            </button>
            {showCartDropdown && (
              <div className="dropdown-panel">
                {cartItems.length === 0 ? (
                  <p className="empty-msg">Cart is empty.</p>
                ) : (
                  <>
                    {cartItems.map((img, i) => (
                      <div className="cart-item" key={i}>
                        <img src={img.url} alt="cart" />
                        <button onClick={() => removeFromCart(img.asset_id)}>❌</button>
                      </div>
                    ))}
                    <button className="btn brown" onClick={handleRequestImages}>Request These</button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Approved */}
          <div className="dropdown">
            <button className="btn brown" onClick={() => setShowApprovedDropdown(!showApprovedDropdown)}>
              Approved
            </button>
            {showApprovedDropdown && (
              <div className="dropdown-panel">
                {approvedImages.length === 0 ? (
                  <p className="empty-msg">No approved images.</p>
                ) : (
                  <>
                    {!downloadedOnce ? (
                      <div className="d-flex justify-between mb">
                        <button className="btn gray" onClick={downloadAllAsZip}>Download All</button>
                      </div>
                    ) : (
                      <p className="empty-msg" style={{ fontStyle: 'italic', color: '#999' }}>
                        These files have already been downloaded. View history below.
                      </p>
                    )}

                    {newApproved.length > 0 && (
                      <>
                        <p className="section-label">🆕 New Approved</p>
                        {newApproved.map((img, i) => (
                          <div className="cart-item" key={i}>
                            <img src={`${API_BASE}${img.path}`} alt="approved" />
                          </div>
                        ))}
                      </>
                    )}

                    {historyApproved.length > 0 && (
                      <>
                        <p className="section-label" style={{ color: '#888' }}>📁 Download History</p>
                        {historyApproved.map((img, i) => {
                          const meta = downloadedMeta.find(entry => entry.id === (img._id || img.asset_id));
                          return (
                            <div className="cart-item history-item" key={i}>
                              <img src={`${API_BASE}${img.path}`} alt={img.filename || 'downloaded'} />
                              <div className="info-block">
                                <p className="history-filename">{img.filename}</p>
                                <p className="history-date">
                                  📅 {meta?.date ? new Date(meta.date).toLocaleString() : 'Unknown'}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="dropdown profile-dropdown">
            <button className="btn profile-icon" onClick={() => setShowProfileDropdown(!showProfileDropdown)} title="Profile">
              👤
            </button>
            {showProfileDropdown && (
              <div className="dropdown-panel profile-menu">
                {userRole === 'admin' && (
                  <p className="dropdown-item" onClick={() => navigate('/admin/dashboard')}>🛠️ Admin Tools</p>
                )}
                <button className="dropdown-item" onClick={() => document.querySelector('.dark-toggle')?.click()}>
                  <DarkModeToggle />
                </button>
                <button className="dropdown-item" onClick={handleLogout}>🚪 Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main */}
      <div className={`dashboard-main ${searchStarted ? 'shift-up' : ''}`}>
        <ImageSearch onSearchStart={() => setSearchStarted(true)} />
      </div>
    </div>
  );
};

export default UserDashboard;
