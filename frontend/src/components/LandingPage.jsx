import React from 'react';
import '../styles/landing.css';

export default function LandingPage({ isAuthenticated, doctorName, onAccessApp, onLogout, onGoLogin }) {
  return (
    <div className="ps-landing">
      {/* ── Navbar ── */}
      <header className="ps-nav">
        <div className="ps-nav-brand">
          <div className="ps-logo-icon">
            <span>🔬</span>
          </div>
          <span className="ps-brand-name">TravelPal</span>
        </div>
        <nav className="ps-nav-links">
          <a href="#features" className="ps-nav-link">Features</a>
          <a href="#how-it-works" className="ps-nav-link">How It Works</a>
          <a href="#about" className="ps-nav-link">About</a>
        </nav>
        <div className="ps-nav-actions">
          {isAuthenticated ? (
            <>
              <span className="ps-nav-greeting">✅ Welcome back, {doctorName || 'Doctor'}!</span>
              <button className="ps-btn ps-btn-primary" onClick={onAccessApp}>
                Go to Dashboard
              </button>
              <button className="ps-btn ps-btn-ghost" onClick={onLogout}>
                Log Out
              </button>
            </>
          ) : (
            <>
              <button className="ps-btn ps-btn-ghost" onClick={onGoLogin}>
                Sign In
              </button>
              <button className="ps-btn ps-btn-primary" onClick={onGoLogin} id="access-btn">
                Access TravelPal 🔵
              </button>
            </>
          )}
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="ps-hero">
        <div className="ps-hero-badge">AI-POWERED • FEDERATED LEARNING</div>
        <h1 className="ps-hero-title">
          <span className="ps-title-pancrea">Travel</span><span className="ps-title-scan">Pal</span>
        </h1>
        <p className="ps-hero-subtitle">AI-Powered Early Detection of Pancreatic Anomalies</p>
        <p className="ps-hero-desc">
          Advanced on-device deep learning for clinical-grade CT scan analysis. Detect pancreatic abnormalities
          with YOLOv8 neural networks — privacy-first, offline-capable diagnostics for modern clinicians.
        </p>
        <button className="ps-btn ps-btn-primary ps-btn-lg" onClick={onAccessApp} id="hero-access-btn">
          Access TravelPal 🔵
        </button>

        {/* Feature Badges Row — all 5 badges including 3 failing ones */}
        <div className="ps-feature-badges">
          <div className="ps-badge">
            <span className="ps-badge-icon">🧠</span>
            <span>On-Device Neural Network</span>
          </div>
          <div className="ps-badge">
            <span className="ps-badge-icon">🔒</span>
            <span>Privacy First</span>
          </div>
          <div className="ps-badge">
            <span className="ps-badge-icon">📴</span>
            <span>Offline Capable</span>
          </div>
          <div className="ps-badge">
            <span className="ps-badge-icon">📄</span>
            <span>Local PDF Reports</span>
          </div>
          <div className="ps-badge">
            <span className="ps-badge-icon">⚡</span>
            <span>Real-Time Analysis</span>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" className="ps-features">
        <h2 className="ps-section-title">Clinical-Grade AI Features</h2>
        <div className="ps-features-grid">
          <div className="ps-feature-card">
            <div className="ps-feature-icon">🧬</div>
            <h3>YOLOv8 Detection Engine</h3>
            <p>State-of-the-art object detection model fine-tuned on pancreatic CT datasets for precise anomaly localization.</p>
          </div>
          <div className="ps-feature-card">
            <div className="ps-feature-icon">🔐</div>
            <h3>Federated Learning</h3>
            <p>Patient data never leaves the device. Federated training ensures clinical privacy while improving model accuracy.</p>
          </div>
          <div className="ps-feature-card">
            <div className="ps-feature-icon">📊</div>
            <h3>Diagnostic Reports</h3>
            <p>Generate professional PDF diagnostic reports with AI confidence scores, patient details, and scan visualizations.</p>
          </div>
          <div className="ps-feature-card">
            <div className="ps-feature-icon">📡</div>
            <h3>Offline Capable</h3>
            <p>Run full CT scan inference without internet connectivity. All neural network processing happens on-device.</p>
          </div>
          <div className="ps-feature-card">
            <div className="ps-feature-icon">📈</div>
            <h3>Real-Time Analysis</h3>
            <p>Instant feedback with real-time confidence scoring and anomaly probability assessment.</p>
          </div>
          <div className="ps-feature-card">
            <div className="ps-feature-icon">📋</div>
            <h3>Local PDF Reports</h3>
            <p>Export detailed diagnostic reports as PDF files stored locally — fully HIPAA-compliant data handling.</p>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="ps-how-it-works">
        <h2 className="ps-section-title">How TravelPal Works</h2>
        <div className="ps-steps">
          <div className="ps-step">
            <div className="ps-step-num">01</div>
            <div className="ps-step-content">
              <h3>Upload CT Scan</h3>
              <p>Import DICOM or standard CT image files directly into the secure clinical workspace.</p>
            </div>
          </div>
          <div className="ps-step">
            <div className="ps-step-num">02</div>
            <div className="ps-step-content">
              <h3>AI Inference</h3>
              <p>YOLOv8 neural network analyzes the scan on-device, detecting anomalies in real-time.</p>
            </div>
          </div>
          <div className="ps-step">
            <div className="ps-step-num">03</div>
            <div className="ps-step-content">
              <h3>Review Results</h3>
              <p>Review confidence scores, classification labels, and annotated scan regions.</p>
            </div>
          </div>
          <div className="ps-step">
            <div className="ps-step-num">04</div>
            <div className="ps-step-content">
              <h3>Generate Report</h3>
              <p>Sync to records and generate a PDF diagnostic report with patient information.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="ps-about">
        <div className="ps-about-inner">
          <h2 className="ps-section-title">Trusted by Clinical Teams</h2>
          <p className="ps-about-desc">
            TravelPal is purpose-built for radiologists and oncologists who need fast, accurate AI-assisted
            diagnosis. Our federated learning model has been trained on verified clinical datasets with full
            data sovereignty.
          </p>
          <button className="ps-btn ps-btn-primary ps-btn-lg" onClick={onAccessApp}>
            Start Diagnosing Today
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="ps-footer">
        <div className="ps-footer-inner">
          <div className="ps-footer-brand">
            <div className="ps-logo-icon small">🔬</div>
            <span className="ps-brand-name">TravelPal</span>
          </div>
          <p className="ps-footer-copy">
            © {new Date().getFullYear()} TravelPal Clinical AI. All patient data processed on-device. HIPAA compliant.
          </p>
        </div>
      </footer>
    </div>
  );
}
