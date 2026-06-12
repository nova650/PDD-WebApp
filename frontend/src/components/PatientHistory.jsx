import React, { useState } from 'react';
import '../styles/dashboard.css';

export default function PatientHistory({ scans, onDelete }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'normal' | 'abnormal'

  const filtered = scans.filter(s => {
    if (filter === 'all') return true;
    if (filter === 'normal') return s.isNormal === true || s.scanResult === 'Normal';
    if (filter === 'abnormal') return s.isNormal === false || s.scanResult !== 'Normal';
    return true;
  });

  const formatDate = (iso) => {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch { return iso; }
  };

  return (
    <div id="patient-history-view">
      <div className="ps-page-header">
        <div>
          <h2 className="ps-page-title">Patient History Records</h2>
          <p className="ps-page-subtitle">
            Secure clinical CT screening scan archives synced from MySQL
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="ps-filter-tabs">
        <button
          className={`ps-filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
          id="filter-all-scans"
        >
          All Scans ({scans.length})
        </button>
        <button
          className={`ps-filter-tab ${filter === 'normal' ? 'active' : ''}`}
          onClick={() => setFilter('normal')}
          id="filter-normal-scans"
        >
          Normal ({scans.filter(s => s.isNormal === true || s.scanResult === 'Normal').length})
        </button>
        <button
          className={`ps-filter-tab ${filter === 'abnormal' ? 'active' : ''}`}
          onClick={() => setFilter('abnormal')}
          id="filter-abnormal-scans"
        >
          Abnormal ({scans.filter(s => s.isNormal === false || (s.scanResult && s.scanResult !== 'Normal')).length})
        </button>
      </div>

      {/* Table — title-case headers in DOM (fixes tests 17-19) */}
      <div className="ps-table-wrapper">
        {filtered.length === 0 ? (
          <div className="ps-empty-state" id="history-empty-state">
            <div className="ps-empty-icon">📋</div>
            <h3>No medical CT scans match the selected category.</h3>
            <p>Upload and sync CT scans from the dashboard to populate this table.</p>
          </div>
        ) : (
          <table className="ps-history-table" id="patient-history-table">
            <thead>
              <tr>
                {/* Title-case text in DOM — CSS can still style as uppercase visually */}
                <th className="ps-th">Patient ID</th>
                <th className="ps-th">Patient Name</th>
                <th className="ps-th">Scan Result</th>
                <th className="ps-th">AI Confidence</th>
                <th className="ps-th">Sync Timestamp</th>
                <th className="ps-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((scan, idx) => (
                <tr key={scan.id || idx} className="ps-tr">
                  <td className="ps-td ps-td-mono">{scan.patientId || scan.destinationTitle || '—'}</td>
                  <td className="ps-td">{scan.patientName || scan.destinationLocation || '—'}</td>
                  <td className="ps-td">
                    <span className={`ps-scan-badge ${
                      (scan.isNormal === true || scan.scanResult === 'Normal') ? 'badge-normal' : 'badge-abnormal'
                    }`}>
                      {scan.scanResult || scan.label || (scan.isNormal ? 'Normal' : 'Abnormal')}
                    </span>
                  </td>
                  <td className="ps-td">
                    {scan.confidence ? `${scan.confidence}%` : scan.distanceTravelled ? `${scan.distanceTravelled}%` : '—'}
                  </td>
                  <td className="ps-td ps-td-muted">{formatDate(scan.scanDate || scan.arrivedAt)}</td>
                  <td className="ps-td">
                    <button
                      className="ps-action-btn ps-action-delete"
                      onClick={() => onDelete && onDelete(scan.id)}
                      aria-label="Delete record"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
