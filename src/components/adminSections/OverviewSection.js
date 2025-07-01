// components/OverviewSection.js
import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import './OverviewSection.css';

const OverviewSection = ({
  requests,
  uploadedImages,
  chartType,
  setChartType,
  filterMode,
  setFilterMode,
  handleDownloadExcelReport
}) => {
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
      let key = filterMode === 'day'
        ? date.toLocaleDateString()
        : `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      counts[key] = (counts[key] || 0) + 1;
    });

    const labels = Object.keys(counts).sort((a, b) => new Date(a) - new Date(b));
    const values = labels.map(label => counts[label]);
    return { labels, values };
  };

  const { labels, values } = getFilteredData();

  const chartData = {
    labels,
    datasets: [{
      label: 'Request Volume',
      data: values,
      fill: true,
      backgroundColor: 'rgba(13, 110, 253, 0.2)',
      borderColor: 'rgba(13, 110, 253, 1)',
      tension: 0.4,
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: `Requests by ${filterMode === 'day' ? 'Day' : 'Month'}`,
      },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
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

  return (
    <div className="container-fluid animate__animated animate__fadeIn">
      {/* Stats Section */}
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

      {/* Summary Row */}
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

      {/* Tag & Chart Row */}
      <div className="chart-tag-row">
        {/* Tag Summary */}
        <div className="tag-box">
  <h6 className="section-subtitle">🏷️ Tag Usage Summary</h6>
  {sortedTags.length === 0 ? (
    <p className="text-muted">No tags found in uploaded images.</p>
  ) : (
    <div className="tag-summary-scroll"> {/* ✅ Add this wrapper */}
      <ul className="list-group">
        {sortedTags.map(([tag, count], i) => (
          <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
            <span className="badge bg-primary px-3 py-2 text-uppercase">{tag}</span>
            <span className="badge bg-secondary">{count} image{count > 1 ? 's' : ''}</span>
          </li>
        ))}
      </ul>
    </div>
  )}
</div>


        {/* Chart Section */}
        <div className="chart-box">
          <div className="chart-controls">
            <select className="form-select w-auto" value={chartType} onChange={(e) => setChartType(e.target.value)}>
              <option value="line">📈 Line Chart</option>
              <option value="bar">📊 Bar Chart</option>
            </select>
            <select className="form-select w-auto" value={filterMode} onChange={(e) => setFilterMode(e.target.value)}>
              <option value="month">By Month</option>
              <option value="day">By Day</option>
            </select>
            <button className="btn btn-outline-success" onClick={handleDownloadExcelReport}>
              📥 Download Excel Report
            </button>
          </div>
          <div className="card border-0 shadow-sm p-3 chart-card">
  <ChartComponent data={chartData} options={chartOptions} />
</div>

        </div>
      </div>
    </div>
  );
};

export default OverviewSection;
