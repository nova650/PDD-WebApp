import React, { useState, useRef } from 'react';
import DiagnosticReport from './DiagnosticReport';
import '../styles/workspace.css';

// Simulate YOLOv8 TFLite inference result
function simulateInference() {
  const labels = ['Normal', 'Abnormal - Adenocarcinoma', 'Abnormal - Cystic Lesion', 'Abnormal - Neuroendocrine'];
  const isNormal = Math.random() > 0.45;
  const label = isNormal ? 'Normal' : labels[Math.floor(Math.random() * 3) + 1];
  const confidence = isNormal
    ? (88 + Math.random() * 10).toFixed(1)
    : (72 + Math.random() * 22).toFixed(1);
  return { label, confidence: parseFloat(confidence), isNormal };
}

export default function CTScanWorkspace({ onClose, patientHistory, onSyncComplete }) {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [inferenceState, setInferenceState] = useState('idle'); // idle | scanning | done
  const [result, setResult] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setUploadedImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRunInference = () => {
    if (!uploadedImage) return;
    setInferenceState('scanning');
    setResult(null);

    // Simulate scanning animation duration (2.5s)
    setTimeout(() => {
      const inferenceResult = simulateInference();
      setResult(inferenceResult);
      setInferenceState('done');
    }, 2500);
  };

  const handleRescan = () => {
    setResult(null);
    setInferenceState('idle');
  };

  const handleSync = () => {
    if (!result) return;
    const report = {
      patientId: patientId || `PS-${Date.now().toString().slice(-6)}`,
      patientName: patientName || 'Unknown Patient',
      scanDate: new Date().toISOString(),
      label: result.label,
      confidence: result.confidence,
      isNormal: result.isNormal,
      imageDataUrl: uploadedImage,
    };
    setReportData(report);
    setShowReport(true);
    if (onSyncComplete) onSyncComplete(report);
  };

  // Show diagnostic report after sync
  if (showReport && reportData) {
    return (
      <DiagnosticReport
        report={reportData}
        onReturnToDashboard={() => {
          setShowReport(false);
          onClose();
        }}
      />
    );
  }

  return (
    <div className="workspace-overlay" id="ct-workspace-modal">
      <div className="workspace-modal">
        {/* Header */}
        <div className="workspace-header">
          <h2 className="workspace-title" id="workspace-modal-title">
            🫁 CT Scan Workspace
          </h2>
          <button
            className="workspace-close-btn"
            onClick={onClose}
            id="workspace-close-btn"
            aria-label="Close workspace"
          >
            ✕
          </button>
        </div>

        <div className="workspace-body">
          {/* Left: Image Preview */}
          <div className="workspace-image-panel">
            {uploadedImage ? (
              <img
                src={uploadedImage}
                alt="CT Scan Preview"
                className="workspace-ct-image"
                id="ct-image-preview"
              />
            ) : (
              <div className="workspace-image-placeholder">
                <div className="placeholder-icon">🔬</div>
                <p>No CT scan loaded</p>
                <p className="placeholder-hint">Upload a scan to begin analysis</p>
              </div>
            )}

            {/* Scanning animation overlay */}
            {inferenceState === 'scanning' && (
              <div className="workspace-scanning-overlay" id="scanning-animation">
                <div className="scanning-bar"></div>
                <div className="scanning-label">
                  <span className="scanning-spinner">⏳</span>
                  Running YOLOv8 Inference...
                </div>
              </div>
            )}
          </div>

          {/* Right: Controls Panel */}
          <div className="workspace-controls">
            {/* Patient Info */}
            <div className="workspace-section">
              <h3 className="workspace-section-title">Patient Information</h3>
              <div className="workspace-field">
                <label className="workspace-label" htmlFor="patient-id-input">
                  Patient ID
                </label>
                <input
                  id="patient-id-input"
                  type="text"
                  className="workspace-input"
                  placeholder="e.g. PS-001234"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                />
              </div>
              <div className="workspace-field">
                <label className="workspace-label" htmlFor="patient-name-input">
                  Patient Name
                </label>
                <input
                  id="patient-name-input"
                  type="text"
                  className="workspace-input"
                  placeholder="Full name of patient"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="workspace-section">
              <h3 className="workspace-section-title">CT Scan Image</h3>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.dcm"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="ct-file-input"
              />
              <button
                className="workspace-btn workspace-btn-secondary"
                onClick={() => fileInputRef.current?.click()}
                id="select-ct-scan-btn"
              >
                📂 Select CT Scan Image
              </button>
            </div>

            {/* Inference Actions */}
            <div className="workspace-section">
              {inferenceState === 'idle' && (
                <button
                  className="workspace-btn workspace-btn-primary"
                  onClick={handleRunInference}
                  disabled={!uploadedImage}
                  id="run-inference-btn"
                >
                  🚀 Run TFLite Inference
                </button>
              )}

              {inferenceState === 'scanning' && (
                <button
                  className="workspace-btn workspace-btn-primary"
                  disabled
                  id="run-inference-btn"
                >
                  ⏳ Analyzing...
                </button>
              )}

              {/* Results — shown after inference completes */}
              {inferenceState === 'done' && result && (
                <div className="workspace-results" id="inference-results">
                  <div className={`result-label-badge ${result.isNormal ? 'result-normal' : 'result-abnormal'}`}
                    id="yolov8-result-label">
                    <span className="result-icon">{result.isNormal ? '✅' : '⚠️'}</span>
                    <span className="result-text">{result.label}</span>
                  </div>

                  <div className="result-confidence" id="confidence-score">
                    <span className="confidence-label">AI Confidence</span>
                    <span className="confidence-value">{result.confidence}%</span>
                    <div className="confidence-bar-track">
                      <div
                        className="confidence-bar-fill"
                        style={{ width: `${result.confidence}%`, background: result.isNormal ? '#10b981' : '#ef4444' }}
                      />
                    </div>
                  </div>

                  <div className="result-engine-tag">
                    YOLOv8 Neural Engine · TFLite Runtime
                  </div>

                  <div className="result-actions" id="result-action-buttons">
                    <button
                      className="workspace-btn workspace-btn-secondary"
                      onClick={handleRescan}
                      id="rescan-btn"
                    >
                      🔄 Rescan
                    </button>
                    <button
                      className="workspace-btn workspace-btn-primary"
                      onClick={handleSync}
                      id="sync-btn"
                    >
                      ☁️ Sync
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
