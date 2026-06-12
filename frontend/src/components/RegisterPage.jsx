import React, { useState } from 'react';
import { authAPI } from '../utils/api';
import '../styles/auth.css';

export default function RegisterPage({ onRegisterSuccess, onGoLogin }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const data = await authAPI.signup(email.trim(), password.trim(), fullName.trim());
      onRegisterSuccess(data.email, fullName.trim());
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-page-card">
        <div className="auth-logo-row">
          <div className="auth-logo-icon">🔬</div>
          <span className="auth-brand">TravelPal</span>
        </div>

        <h1 className="auth-heading">Create Account</h1>
        <p className="auth-subheading">Join TravelPal — AI-powered diagnostics</p>

        {error && (
          <div className="auth-error-toast" id="register-error-toast">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" id="register-form">
          <div className="auth-field">
            <label className="auth-label" htmlFor="register-fullname">Full Name</label>
            <input
              id="register-fullname"
              type="text"
              className="auth-input"
              placeholder="Dr. Jane Smith"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
              autoComplete="name"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="register-email">Email Address</label>
            <input
              id="register-email"
              type="email"
              className="auth-input"
              placeholder="doctor@clinic.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="register-password">Password</label>
            <input
              id="register-password"
              type="password"
              className="auth-input"
              placeholder="Create a secure password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="register-confirm-password">Confirm Password</label>
            <input
              id="register-confirm-password"
              type="password"
              className="auth-input"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            id="create-account-btn"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch-row">
          Already have an account?{' '}
          <button
            type="button"
            className="auth-link-btn"
            onClick={onGoLogin}
            id="back-to-login-link"
          >
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );
}
