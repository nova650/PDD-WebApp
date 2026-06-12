import React from 'react';

export default function SosLogs({ logs }) {
  return (
    <div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
        Live outputs of simulated SMS requests processed by the application:
      </p>
      <div className="console-box" style={{ height: '350px' }}>
        {logs.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', paddingTop: '6rem' }}>
            Console idle. Trigger SOS or arrive at a destination to dispatch SMS notifications.
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="console-line">
              <span className="console-timestamp">[{log.timestamp}]</span>
              <span style={{ color: '#60a5fa', fontWeight: 600 }}>Simulated SMS</span>
              <div style={{ paddingLeft: '1rem', borderLeft: '2px solid rgba(255,255,255,0.1)', margin: '0.25rem 0' }}>
                <div style={{ color: '#34d399' }}>To: {log.contacts.join(', ')}</div>
                <div className="console-text">"{log.message}"</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
