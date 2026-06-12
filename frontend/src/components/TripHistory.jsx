import React from 'react';
import { Calendar, Navigation, Clock, Trash2, Milestone } from 'lucide-react';

export default function TripHistory({ history, onClearHistory }) {
  
  // Calculate analytics
  const totalTrips = history.length;
  const totalDistance = history.reduce((sum, item) => sum + parseFloat(item.distanceTravelled || 0), 0);
  const avgDuration = totalTrips > 0
    ? Math.round(history.reduce((sum, item) => sum + parseInt(item.durationMinutes || 0), 0) / totalTrips)
    : 0;

  const formatDate = (epochMs) => {
    const d = new Date(epochMs);
    return d.toLocaleDateString(undefined, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear all trip history?")) {
      onClearHistory();
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Trip Analytics & History</h2>
          <p className="page-subtitle">Overview of your completed journeys and distance logs.</p>
        </div>
        {history.length > 0 && (
          <button className="btn btn-danger" onClick={handleClear}>
            <Trash2 size={16} /> Clear History
          </button>
        )}
      </div>

      {/* Analytics Tiles */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Trips
          </h4>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.5rem' }}>
            {totalTrips}
          </p>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Distance
          </h4>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)', marginTop: '0.5rem' }}>
            {totalDistance.toFixed(1)} km
          </p>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Avg Duration
          </h4>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)', marginTop: '0.5rem' }}>
            {avgDuration} min
          </p>
        </div>
      </div>

      {/* Trip Timeline */}
      <div className="glass-card">
        {history.length === 0 ? (
          <div className="empty-state">
            <Milestone className="empty-icon" />
            <h3>No Trip History Recorded</h3>
            <p>Once you track a destination and arrive within its 5km radius, it will log here.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {history.map((trip) => (
              <div 
                key={trip.id} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '1rem 1.25rem', 
                  borderBottom: '1px solid var(--border-color)',
                  background: 'rgba(255, 255, 255, 0.01)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{trip.destinationTitle}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    <Calendar size={12} />
                    <span>{formatDate(trip.arrivedAt)}</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {trip.destinationLocation}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)' }}>
                    <Navigation size={14} />
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{trip.distanceTravelled.toFixed(1)} km</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--secondary)' }}>
                    <Clock size={14} />
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{trip.durationMinutes} min</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
