import React, { useState } from 'react';
import { X, ShieldAlert, Mail, Key, Eye, EyeOff } from 'lucide-react';
import { authAPI } from '../utils/api';

export default function AuthModal({ onClose, onSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const data = await authAPI.login(email.trim(), password.trim());
        onSuccess(data.email);
      } else {
        const data = await authAPI.signup(email.trim(), password.trim());
        onSuccess(data.email);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose} style={{ background: 'none', border: 'none' }}>
          <X size={20} />
        </button>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--primary)' }}>
          <ShieldAlert size={40} />
        </div>

        <h3 className="auth-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h3>
        <p className="auth-subtitle">
          {isLogin ? 'Log in to sync your saved destinations.' : 'Sign up to safely persist your emergency configuration.'}
        </p>

        {error && (
          <div 
            className="auth-error"
            style={{ 
              background: 'rgba(239, 68, 68, 0.12)', 
              border: '1px solid var(--danger)', 
              color: '#fca5a5', 
              padding: '0.75rem', 
              borderRadius: 'var(--radius-sm)', 
              marginBottom: '1rem',
              fontSize: '0.8rem',
              textAlign: 'center'
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-muted)' }} />
              <input
                type="email"
                className="form-input"
                placeholder="name@domain.com"
                style={{ paddingLeft: '2.5rem' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Key size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter password"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '13px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-switch-prompt">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            className="auth-switch-link" 
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </span>
        </div>
      </div>
    </div>
  );
}
