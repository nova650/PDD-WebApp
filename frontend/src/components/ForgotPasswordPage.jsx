import React, { useState } from 'react';
import '../styles/auth.css';

export default function ForgotPasswordPage({ onBackToLogin }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    setError('');
    setLoading(true);

    // Simulated password recovery (no backend endpoint)
    setTimeout(() => {
      setLoading(false);
      setError('No account found with this email address.');
    }, 800);
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-page-card">
        <div className="auth-logo-row">
          <div className="auth-logo-icon">🔬</div>
          <span className="auth-brand">TravelPal</span>
        </div>

        <h1 className="auth-heading">Reset Password</h1>
        <p className="auth-subheading" id="forgot-subtitle">
          Enter your email and we'll send you recovery instructions
        </p>

        {error && (
          <div className="auth-error-toast" id="forgot-error-toast">
            {error}
          </div>
        )}
        {message && (
          <div className="auth-success-toast" id="forgot-success-toast">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" id="forgot-form">
          <div className="auth-field">
            <label className="auth-label" htmlFor="forgot-email">Email Address</label>
            <input
              id="forgot-email"
              type="email"
              className="auth-input"
              placeholder="doctor@clinic.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            id="check-email-btn"
            disabled={loading}
          >
            {loading ? 'Checking...' : 'Check Email'}
          </button>
        </form>

        <p className="auth-switch-row">
          <button
            type="button"
            className="auth-link-btn"
            onClick={onBackToLogin}
            id="forgot-back-to-login"
          >
            ← Back to Login
          </button>
        </p>
      </div>
    </div>
  );
}
