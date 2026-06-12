import React, { useState } from 'react';
import '../styles/dashboard.css';

export default function Settings({ doctorName, email, onLogout }) {
  const [modelVersion] = useState('YOLOv8n-pancreas-v2.1.3');
  const [lastSync, setLastSync] = useState('Never');
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [updateMsg, setUpdateMsg] = useState('');

  const handleCheckUpdate = () => {
    setCheckingUpdate(true);
    setUpdateMsg('');
    setTimeout(() => {
      setCheckingUpdate(false);
      setUpdateMsg('✅ Model is up to date — YOLOv8n-pancreas-v2.1.3');
    }, 1200);
  };

  const handleSyncTraining = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setLastSync(new Date().toLocaleTimeString());
    }, 1500);
  };

  return (
    <div id="settings-view">
      <div className="ps-page-header">
        <div>
          <h2 className="ps-page-title">Settings</h2>
          <p className="ps-page-subtitle">Clinical portal preferences and AI model configuration</p>
        </div>
      </div>

      {/* Clinical Profile Section */}
      <div className="ps-settings-section" id="clinical-profile-section">
        <h3 className="ps-settings-heading">
          🩺 Clinical Profile
        </h3>
        <div className="ps-settings-grid">
          <div className="ps-settings-row">
            <span className="ps-settings-label">Doctor Name</span>
            <span className="ps-settings-value" id="settings-doctor-name">
              Dr. {doctorName || 'Unknown'}
            </span>
          </div>
          <div className="ps-settings-row">
            <span className="ps-settings-label">Email Address</span>
            <span className="ps-settings-value" id="settings-email">
              {email || '—'}
            </span>
          </div>
          <div className="ps-settings-row">
            <span className="ps-settings-label">Role</span>
            <span className="ps-settings-value">Clinical Radiologist</span>
          </div>
          <div className="ps-settings-row">
            <span className="ps-settings-label">Institution</span>
            <span className="ps-settings-value">TravelPal Clinical Portal</span>
          </div>
        </div>
      </div>

      {/* Federated AI Model Section */}
      <div className="ps-settings-section" id="federated-ai-model-section">
        <h3 className="ps-settings-heading">
          🤖 Federated AI Model
        </h3>
        <div className="ps-settings-grid">
          <div className="ps-settings-row">
            <span className="ps-settings-label">Engine Name</span>
            <span className="ps-settings-value" id="settings-yolov8-engine">
              YOLOv8 Neural Engine
            </span>
          </div>
          <div className="ps-settings-row">
            <span className="ps-settings-label">Model Version</span>
            <span className="ps-settings-value ps-mono">{modelVersion}</span>
          </div>
          <div className="ps-settings-row">
            <span className="ps-settings-label">Runtime</span>
            <span className="ps-settings-value">TFLite · On-Device</span>
          </div>
          <div className="ps-settings-row">
            <span className="ps-settings-label">Last Training Sync</span>
            <span className="ps-settings-value">{lastSync}</span>
          </div>
        </div>

        {updateMsg && (
          <div className="ps-settings-msg">{updateMsg}</div>
        )}

        <div className="ps-settings-actions">
          <button
            className="ps-btn ps-btn-secondary"
            onClick={handleCheckUpdate}
            disabled={checkingUpdate}
            id="check-model-update-btn"
          >
            {checkingUpdate ? '⏳ Checking...' : '🔄 Check Model Update'}
          </button>
          <button
            className="ps-btn ps-btn-primary"
            onClick={handleSyncTraining}
            disabled={syncing}
            id="sync-training-data-btn"
          >
            {syncing ? '⏳ Syncing...' : '☁️ Sync Training Data'}
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="ps-settings-section ps-settings-danger">
        <h3 className="ps-settings-heading">⚠️ Account Actions</h3>
        <p className="ps-settings-danger-desc">
          Logging out will end your clinical session. Unsaved workspace data may be lost.
        </p>
        <button
          className="ps-btn ps-btn-danger"
          onClick={onLogout}
          id="secure-logout-btn"
        >
          🔒 Secure Log Out
        </button>
      </div>
    </div>
  );
}
