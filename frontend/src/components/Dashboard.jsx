import React, { useState, useRef } from 'react';
import PatientHistory from './PatientHistory';
import Analytics from './Analytics';
import Settings from './Settings';
import CTScanWorkspace from './CTScanWorkspace';
import '../styles/dashboard.css';

export default function Dashboard({ onLogout, email, doctorName }) {
  // 'dashboard' | 'history' | 'analytics' | 'settings'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [scans, setScans] = useState([]);
  const [showWorkspace, setShowWorkspace] = useState(false);
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'normal' | 'abnormal'
  const fileInputRef = useRef(null);

  // Stat calculations
  const normalScans = scans.filter(s => s.isNormal === true);
  const abnormalScans = scans.filter(s => s.isNormal === false);

  const filteredScans = scans.filter(s => {
    if (filterMode === 'normal') return s.isNormal === true;
    if (filterMode === 'abnormal') return s.isNormal === false;
    return true;
  });

  const handleSyncComplete = (report) => {
    const newScan = {
      id: Date.now(),
      patientId: report.patientId,
      patientName: report.patientName,
      scanResult: report.label,
      confidence: report.confidence,
      isNormal: report.isNormal,
      scanDate: report.scanDate,
      label: report.label,
    };
    setScans(prev => [newScan, ...prev]);
  };

  const handleDeleteScan = (id) => {
    setScans(prev => prev.filter(s => s.id !== id));
  };

  const handleFileSelect = (e) => {
    if (e.target.files[0]) {
      setShowWorkspace(true);
    }
  };

  const displayName = doctorName || email?.split('@')[0] || 'Doctor';

  return (
    <div className="ps-app-container" id="dashboard-layout">
      {/* Sidebar */}
      <aside className="ps-sidebar" id="sidebar-nav">
        {/* Brand */}
        <div className="ps-sidebar-brand" id="sidebar-logo">
          <div className="ps-sidebar-logo-icon">🔬</div>
          <span className="ps-sidebar-brand-name" id="sidebar-brand-title">TravelPal</span>
        </div>

        {/* Welcome banner */}
        <div className="ps-welcome-banner">
          ✅ Welcome back, Dr. {displayName}!
        </div>

        {/* Navigation */}
        <nav className="ps-sidebar-nav">
          <button
            className={`ps-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
            id="nav-dashboard"
          >
            <span className="ps-nav-icon">📊</span>
            <span>Dashboard</span>
          </button>

          <button
            className={`ps-nav-item ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
            id="nav-patient-history"
          >
            <span className="ps-nav-icon">🩻</span>
            <span>Patient History</span>
          </button>

          <button
            className={`ps-nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
            id="nav-analytics"
          >
            <span className="ps-nav-icon">📈</span>
            <span>Analytics</span>
          </button>

          <button
            className={`ps-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
            id="nav-settings"
          >
            <span className="ps-nav-icon">⚙️</span>
            <span>Settings</span>
          </button>
        </nav>

        {/* Footer */}
        <div className="ps-sidebar-footer">
          <div className="ps-sidebar-status">
            <span className="ps-status-dot"></span>
            <span>Clinical Portal Diagnostics Suite</span>
          </div>
          <span className="ps-online-badge">Online</span>
          <button
            className="ps-nav-item ps-nav-logout"
            onClick={onLogout}
            id="sidebar-logout-btn"
          >
            <span className="ps-nav-icon">🚪</span>
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ps-main-content">
        {/* Header bar */}
        <div className="ps-main-header">
          <div>
            <h1 className="ps-main-greeting">Hello, Dr. {displayName}</h1>
            <p className="ps-main-sub">Clinical Portal Diagnostics Suite</p>
            <span className="ps-online-text">Online</span>
          </div>
        </div>

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div id="dashboard-overview">
            {/* Stat Cards Row */}
            <div className="ps-stat-cards-row">
              {/* Total Scans */}
              <div
                className={`ps-stat-card ${filterMode === 'all' ? 'stat-active' : ''}`}
                onClick={() => setFilterMode('all')}
                id="total-scans-card"
                style={{ cursor: 'pointer' }}
              >
                <div className="ps-stat-icon">🗂️</div>
                <div className="ps-stat-body">
                  <div className="ps-stat-label">Total Scans</div>
                  <div className="ps-stat-value">{scans.length}</div>
                  <div className="ps-stat-trend">📈 All records</div>
                </div>
              </div>

              {/* Normal Scans */}
              <div
                className={`ps-stat-card stat-normal ${filterMode === 'normal' ? 'stat-active' : ''}`}
                onClick={() => setFilterMode('normal')}
                id="normal-scans-stat-card"
                style={{ cursor: 'pointer' }}
              >
                <div className="ps-stat-icon">✅</div>
                <div className="ps-stat-body">
                  <div className="ps-stat-label">Normal Scans</div>
                  <div className="ps-stat-value">{normalScans.length}</div>
                  <div className="ps-stat-trend">📈 Healthy</div>
                </div>
              </div>

              {/* Abnormal Scans */}
              <div
                className={`ps-stat-card stat-abnormal ${filterMode === 'abnormal' ? 'stat-active' : ''}`}
                onClick={() => setFilterMode('abnormal')}
                id="abnormal-scans-stat-card"
                style={{ cursor: 'pointer' }}
              >
                <div className="ps-stat-icon">⚠️</div>
                <div className="ps-stat-body">
                  <div className="ps-stat-label">Abnormal Scans</div>
                  <div className="ps-stat-value">{abnormalScans.length}</div>
                  <div className="ps-stat-trend">📉 Requires review</div>
                </div>
              </div>
            </div>

            {/* Upload CT Scan button */}
            <div className="ps-upload-section">
              {/* Hidden file input in DOM */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.dcm"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                id="ct-scan-file-input"
              />
              <button
                className="ps-btn ps-btn-primary ps-upload-btn"
                onClick={() => setShowWorkspace(true)}
                id="select-ct-scan-btn"
              >
                🔬 Select CT Scan
              </button>
              <p className="ps-upload-hint">
                Upload a DICOM or CT image to run YOLOv8 inference
              </p>
            </div>

            {/* Recent Scans Table */}
            {filteredScans.length > 0 && (
              <div className="ps-recent-scans">
                <h3 className="ps-section-sub-heading">Recent Scans</h3>
                <table className="ps-history-table" id="dashboard-scan-table">
                  <thead>
                    <tr>
                      <th className="ps-th">Patient ID</th>
                      <th className="ps-th">Patient Name</th>
                      <th className="ps-th">Scan Result</th>
                      <th className="ps-th">AI Confidence</th>
                      <th className="ps-th">Sync Timestamp</th>
                      <th className="ps-th">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredScans.slice(0, 5).map((scan, idx) => (
                      <tr key={scan.id || idx} className="ps-tr">
                        <td className="ps-td ps-td-mono">{scan.patientId}</td>
                        <td className="ps-td">{scan.patientName}</td>
                        <td className="ps-td">
                          <span className={`ps-scan-badge ${scan.isNormal ? 'badge-normal' : 'badge-abnormal'}`}>
                            {scan.scanResult}
                          </span>
                        </td>
                        <td className="ps-td">{scan.confidence}%</td>
                        <td className="ps-td ps-td-muted">
                          {new Date(scan.scanDate).toLocaleString()}
                        </td>
                        <td className="ps-td">
                          <button
                            className="ps-action-btn ps-action-delete"
                            onClick={() => handleDeleteScan(scan.id)}
                          >🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {filteredScans.length === 0 && (
              <div className="ps-empty-dashboard">
                <div className="ps-empty-icon">🔬</div>
                <h3>No CT Scans Yet</h3>
                <p>Click "Select CT Scan" to upload your first scan for AI analysis.</p>
              </div>
            )}
          </div>
        )}

        {/* PATIENT HISTORY TAB */}
        {activeTab === 'history' && (
          <PatientHistory
            scans={scans}
            onDelete={handleDeleteScan}
          />
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <Analytics scans={scans} />
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <Settings
            doctorName={displayName}
            email={email}
            onLogout={onLogout}
          />
        )}
      </main>

      {/* CT Scan Workspace Modal */}
      {showWorkspace && (
        <CTScanWorkspace
          onClose={() => setShowWorkspace(false)}
          onSyncComplete={(report) => {
            handleSyncComplete(report);
          }}
        />
      )}
    </div>
  );
}
