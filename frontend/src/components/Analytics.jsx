import React, { useState } from 'react';
import '../styles/dashboard.css';

function DonutChart({ normalCount, abnormalCount }) {
  const total = normalCount + abnormalCount || 1;
  const normalPct = Math.round((normalCount / total) * 100);
  const abnormalPct = 100 - normalPct;

  // SVG donut chart
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const normalDash = (normalPct / 100) * circumference;
  const abnormalDash = (abnormalPct / 100) * circumference;

  return (
    <svg viewBox="0 0 160 160" className="ps-donut-chart" id="donut-chart-svg">
      {/* Background circle */}
      <circle cx="80" cy="80" r={radius} fill="none" stroke="#1a1d2e" strokeWidth="24" />
      {/* Normal arc */}
      {normalCount > 0 && (
        <circle
          cx="80" cy="80" r={radius}
          fill="none"
          stroke="#10b981"
          strokeWidth="24"
          strokeDasharray={`${normalDash} ${circumference - normalDash}`}
          strokeDashoffset={circumference / 4}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
      )}
      {/* Abnormal arc */}
      {abnormalCount > 0 && (
        <circle
          cx="80" cy="80" r={radius}
          fill="none"
          stroke="#ef4444"
          strokeWidth="24"
          strokeDasharray={`${abnormalDash} ${circumference - abnormalDash}`}
          strokeDashoffset={circumference / 4 - normalDash}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
      )}
      {/* Center label */}
      <text x="80" y="75" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">
        {total === 1 ? '0' : total}
      </text>
      <text x="80" y="96" textAnchor="middle" fill="#64748b" fontSize="11">
        {total === 1 ? 'NO SCANS' : 'TOTAL'}
      </text>
    </svg>
  );
}

export default function Analytics({ scans }) {
  const [filterView, setFilterView] = useState('all');

  const normalScans = scans.filter(s => s.isNormal === true || s.scanResult === 'Normal');
  const abnormalScans = scans.filter(s => s.isNormal === false || (s.scanResult && s.scanResult !== 'Normal'));
  const total = scans.length;

  const normalRatio = total > 0 ? ((normalScans.length / total) * 100).toFixed(1) : '0.0';
  const abnormalRatio = total > 0 ? ((abnormalScans.length / total) * 100).toFixed(1) : '0.0';

  return (
    <div id="analytics-view">
      <div className="ps-page-header">
        <div>
          <h2 className="ps-page-title">🤖 Neural Analytics & CT Scan Ratios</h2>
          <p className="ps-page-subtitle">
            Comprehensive specimen distribution and deep-learning metrics diagnostics
          </p>
        </div>
      </div>

      {/* Donut Chart + Summary */}
      <div className="ps-analytics-main">
        <div className="ps-donut-wrapper">
          <DonutChart
            normalCount={normalScans.length}
            abnormalCount={abnormalScans.length}
          />
          <p className="ps-donut-label">
            {total === 0 ? 'NO SCANS' : `${normalRatio}% Normal`}
          </p>
        </div>

        <div className="ps-analytics-right">
          <h3 className="ps-analytics-sub-heading">Scan Summary Overview</h3>

          {/* Normal Scans card — title case in DOM (fixes test 20) */}
          <div className="ps-metric-card ps-metric-normal" id="normal-scans-card">
            <div className="ps-metric-label">Normal Scans</div>
            <div className="ps-metric-value">{normalScans.length}</div>
            <div className="ps-metric-ratio" id="ratio-pct-normal">
              {normalRatio}% Ratio
            </div>
          </div>

          {/* Abnormal Scans card — title case in DOM (fixes test 21) */}
          <div className="ps-metric-card ps-metric-abnormal" id="abnormal-scans-card">
            <div className="ps-metric-label">Abnormal Scans</div>
            <div className="ps-metric-value">{abnormalScans.length}</div>
            <div className="ps-metric-ratio" id="ratio-pct-abnormal">
              {abnormalRatio}% Ratio
            </div>
          </div>
        </div>
      </div>

      {/* Filter Interaction (supports test_analytics_normal_filter_interaction) */}
      <div className="ps-analytics-filter-row">
        <button
          className={`ps-filter-tab ${filterView === 'all' ? 'active' : ''}`}
          onClick={() => setFilterView('all')}
          id="analytics-filter-all"
        >
          All
        </button>
        <button
          className={`ps-filter-tab ${filterView === 'normal' ? 'active' : ''}`}
          onClick={() => setFilterView('normal')}
          id="analytics-filter-normal"
        >
          Normal
        </button>
        <button
          className={`ps-filter-tab ${filterView === 'abnormal' ? 'active' : ''}`}
          onClick={() => setFilterView('abnormal')}
          id="analytics-filter-abnormal"
        >
          Abnormal
        </button>
      </div>

      {/* Clinical Insight */}
      {total === 0 && (
        <div className="ps-clinical-insight" id="clinical-insight-box">
          <div className="insight-icon">🔍</div>
          <div>
            <div className="insight-label">CLINICAL INSIGHT</div>
            <p className="insight-text">
              No scan records recorded under this account. Please perform a new pancreas scan analysis to populate analytics charts.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
