import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import Dashboard from './components/Dashboard';
import { authAPI } from './utils/api';
import './App.css';

function App() {
  // 'landing' | 'login' | 'register' | 'forgot-password' | 'dashboard'
  const [view, setView] = useState('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [doctorName, setDoctorName] = useState('');

  useEffect(() => {
    const authStatus = authAPI.isAuthenticated();
    setIsAuthenticated(authStatus);
    if (authStatus) {
      setEmail(authAPI.getEmail());
      setDoctorName(authAPI.getName());
    }
  }, []);

  const handleLoginSuccess = (userEmail, name) => {
    setIsAuthenticated(true);
    setEmail(userEmail);
    setDoctorName(name || userEmail.split('@')[0]);
    setView('dashboard');
  };

  const handleLogout = () => {
    authAPI.logout();
    setIsAuthenticated(false);
    setEmail('');
    setDoctorName('');
    setView('login');
  };

  const handleAccessApp = () => {
    if (isAuthenticated) {
      setView('dashboard');
    } else {
      setView('login');
    }
  };

  if (view === 'dashboard' && isAuthenticated) {
    return (
      <Dashboard
        onLogout={handleLogout}
        email={email}
        doctorName={doctorName}
      />
    );
  }

  if (view === 'login') {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onGoRegister={() => setView('register')}
        onGoForgotPassword={() => setView('forgot-password')}
        onBackToLanding={() => setView('landing')}
      />
    );
  }

  if (view === 'register') {
    return (
      <RegisterPage
        onRegisterSuccess={handleLoginSuccess}
        onGoLogin={() => setView('login')}
      />
    );
  }

  if (view === 'forgot-password') {
    return (
      <ForgotPasswordPage
        onBackToLogin={() => setView('login')}
      />
    );
  }

  return (
    <LandingPage
      isAuthenticated={isAuthenticated}
      email={email}
      doctorName={doctorName}
      onAccessApp={handleAccessApp}
      onLogout={handleLogout}
      onGoLogin={() => setView('login')}
    />
  );
}

export default App;
