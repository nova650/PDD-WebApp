import React, { useState, useEffect } from 'react';
import { Save, ShieldAlert, FileText, AlertTriangle } from 'lucide-react';
import SosLogs from './SosLogs';

export default function EmergencyContacts({ 
  isSosActive, 
  onToggleSos, 
  sosLogs, 
  onClearLogs, 
  emergencyContacts, 
  onSaveContacts 
}) {
  const [contacts, setContacts] = useState({ contact1: '', contact2: '', contact3: '' });
  const [message, setMessage] = useState('');

  // Sync state with parent props when they load
  useEffect(() => {
    if (emergencyContacts) {
      setContacts({
        contact1: emergencyContacts.contact1 || '',
        contact2: emergencyContacts.contact2 || '',
        contact3: emergencyContacts.contact3 || ''
      });
    }
  }, [emergencyContacts]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await onSaveContacts(contacts);
      setMessage('Emergency contacts saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to save: ' + err.message);
    }
  };

  const hasAnyContact = contacts.contact1.trim() || contacts.contact2.trim() || contacts.contact3.trim();

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">SOS & Emergency Settings</h2>
          <p className="page-subtitle">Configure contact numbers to alert during emergencies or trips.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: '2rem' }} className="stats-grid">
        {/* Left Panel: Emergency Contacts Form & SOS Button */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={20} color="var(--secondary)" /> Safety Contacts
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              SMS triggers will alert these numbers with coordinates every 60s when SOS is active.
            </p>
          </div>

          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Contact Number 1</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. +1234567890"
                value={contacts.contact1}
                onChange={(e) => setContacts({ ...contacts, contact1: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Number 2</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. +1234567890"
                value={contacts.contact2}
                onChange={(e) => setContacts({ ...contacts, contact2: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Number 3</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. +1234567890"
                value={contacts.contact3}
                onChange={(e) => setContacts({ ...contacts, contact3: e.target.value })}
              />
            </div>

            {message && (
              <div style={{ color: 'var(--success)', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 600 }}>
                {message}
              </div>
            )}

            <button type="submit" className="btn btn-secondary" style={{ width: '100%' }}>
              <Save size={16} /> Save Contacts
            </button>
          </form>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', textAlign: 'center' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Instant SOS Alert</h4>
            
            <button 
              className={`sos-pulse-btn ${isSosActive ? 'active' : ''}`}
              onClick={onToggleSos}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}
            >
              <span>{isSosActive ? 'STOP' : 'SOS'}</span>
              <span style={{ fontSize: '0.65rem', letterSpacing: '0.05em', opacity: 0.8 }}>
                {isSosActive ? 'TRIGGER ACTIVE' : 'PRESS TO ALERT'}
              </span>
            </button>
            
            {!hasAnyContact && !isSosActive && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', padding: '0.5rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', marginTop: '1rem', textAlign: 'left' }}>
                <AlertTriangle size={14} style={{ flexShrink: 0 }} />
                <span>Save at least one contact above to broadcast location coordinates!</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Simulated SOS console logs */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={20} color="var(--primary)" /> SOS Simulated Gateway Log
            </h3>
            {sosLogs.length > 0 && (
              <button className="btn btn-secondary" onClick={onClearLogs} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                Clear Log
              </button>
            )}
          </div>
          
          <SosLogs logs={sosLogs} />
        </div>
      </div>
    </div>
  );
}
