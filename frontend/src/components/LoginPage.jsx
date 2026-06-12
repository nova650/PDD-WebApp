import React, { useState } from 'react';
import { authAPI } from '../utils/api';
import '../styles/auth.css';

export default function LoginPage({ onLoginSuccess, onGoRegister, onGoForgotPassword, onBackToLanding }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const data = await authAPI.login(email.trim(), password.trim());
      onLoginSuccess(data.email, data.name || email.split('@')[0]);
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-page-card">
        {/* Logo */}
        <div className="auth-logo-row">
          <div className="auth-logo-icon">🔬</div>
          <span className="auth-brand">TravelPal</span>
        </div>

        <h1 className="auth-heading">Welcome Back</h1>
        <p className="auth-subheading">Sign in to your clinical portal account</p>

        {error && (
          <div className="auth-error-toast" id="login-error-toast">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" id="login-form">
          {/* Email */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              className="auth-input"
              placeholder="doctor@clinic.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="login-password">Password</label>
            <div className="auth-input-wrapper">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="auth-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="auth-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                id="show-password-toggle"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Remember Me + Forgot Password row */}
          <div className="auth-options-row">
            <label className="auth-remember-label" htmlFor="remember-me-checkbox">
              {/* Native visible checkbox — fully interactable by Selenium */}
              <input
                id="remember-me-checkbox"
                type="checkbox"
                className="auth-remember-checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="auth-remember-text">Remember me</span>
            </label>
            <button
              type="button"
              className="auth-link-btn"
              onClick={onGoForgotPassword}
              id="forgot-password-link"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            id="login-submit-btn"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-switch-row">
          Don't have an account?{' '}
          <button
            type="button"
            className="auth-link-btn"
            onClick={onGoRegister}
            id="create-account-link"
          >
            Create Account
          </button>
        </p>

        <button
          type="button"
          className="auth-back-link"
          onClick={onBackToLanding}
        >
          ← Back to TravelPal
        </button>
      </div>
    </div>
  );
}
