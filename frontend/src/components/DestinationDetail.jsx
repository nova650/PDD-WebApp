import React, { useEffect } from 'react';
import { ArrowLeft, Play, Square, MessageSquare, AlertTriangle, Compass, Map, Clock, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { calculateDistance, calculateBearing, calculateEta } from '../utils/navigation';
import 'leaflet/dist/leaflet.css';

// SVG Markers
const userIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="%233b82f6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3" fill="white"></circle></svg>',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const targetIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="%23ef4444" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

// Update map bounds to fit both points
function FitBounds({ userLoc, targetLoc }) {
  const map = useMap();
  useEffect(() => {
    if (userLoc && targetLoc) {
      const bounds = L.latLngBounds([
        [userLoc.lat, userLoc.lon],
        [targetLoc.latitude, targetLoc.longitude]
      ]);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (targetLoc) {
      map.setView([targetLoc.latitude, targetLoc.longitude], 13);
    }
  }, [userLoc, targetLoc, map]);
  return null;
}

export default function DestinationDetail({
  dest,
  userLocation,
  activeTrackingDest,
  notifyContact,
  onToggleNotifyContact,
  onStartTracking,
  onStopTracking,
  tripStartTime,
  initialDistance,
  onBack
}) {
  const isCurrentlyTrackingThis = activeTrackingDest && activeTrackingDest.id === dest.id;
  const isTrackingOther = activeTrackingDest && activeTrackingDest.id !== dest.id;

  // Perform active telemetry calculations
  const distanceRemaining = userLocation
    ? calculateDistance(userLocation.lat, userLocation.lon, dest.latitude, dest.longitude)
    : 0;

  const bearing = userLocation
    ? calculateBearing(userLocation.lat, userLocation.lon, dest.latitude, dest.longitude)
    : '';

  const eta = isCurrentlyTrackingThis && userLocation
    ? calculateEta(distanceRemaining, initialDistance, tripStartTime)
    : null;

  return (
    <div>
      <div className="page-header">
        <div>
          <button className="btn btn-secondary" onClick={onBack} style={{ padding: '0.5rem 1rem', marginBottom: '1rem' }}>
            <ArrowLeft size={16} /> Back
          </button>
          <h2 className="page-title">{dest.title}</h2>
          <p className="page-subtitle">{dest.location}</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {isCurrentlyTrackingThis ? (
            <button className="btn btn-danger" onClick={onStopTracking}>
              <Square size={16} /> Stop Alert Service
            </button>
          ) : (
            <button 
              className="btn btn-primary" 
              onClick={() => onStartTracking(dest)}
              disabled={isTrackingOther}
            >
              <Play size={16} /> Start Alert Service
            </button>
          )}
        </div>
      </div>

      {isTrackingOther && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid var(--danger)', color: '#fca5a5', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          <AlertTriangle size={18} />
          <span>You are already tracking another destination: <strong>{activeTrackingDest.title}</strong>. Stop it first to track this one.</span>
        </div>
      )}

      {/* Telemetry Dashboard */}
      <div className="telemetry-grid">
        <div className="telemetry-card">
          <Navigation size={24} style={{ color: 'var(--primary)' }} />
          <div className="telemetry-val">{isCurrentlyTrackingThis ? distanceRemaining : '~'} km</div>
          <div className="telemetry-lbl">Distance Remaining</div>
        </div>

        <div className="telemetry-card">
          <Compass size={24} style={{ color: 'var(--secondary)' }} />
          <div className="telemetry-val">{isCurrentlyTrackingThis ? bearing || '↑ N' : '~'}</div>
          <div className="telemetry-lbl">Bearing</div>
        </div>

        <div className="telemetry-card">
          <Clock size={24} style={{ color: 'var(--accent)' }} />
          <div className="telemetry-val">
            {isCurrentlyTrackingThis ? (eta !== null ? `~${eta} min` : 'Calibrating...') : '~'}
          </div>
          <div className="telemetry-lbl">Estimated ETA</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: '2rem', marginTop: '1.5rem' }} className="stats-grid">
        {/* Map View */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '400px' }}>
          <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Map size={18} color="var(--primary)" /> Route Map
          </h3>
          <div className="map-container-wrapper" style={{ flexGrow: 1, height: 'auto', minHeight: '320px' }}>
            <MapContainer
              center={[dest.latitude, dest.longitude]}
              zoom={13}
              style={{ width: '100%', height: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <FitBounds userLoc={userLocation} targetLoc={dest} />
              
              {/* Target Marker */}
              <Marker position={[dest.latitude, dest.longitude]} icon={targetIcon} />
              
              {/* User Location Marker & Path */}
              {userLocation && (
                <>
                  <Marker position={[userLocation.lat, userLocation.lon]} icon={userIcon} />
                  <Polyline 
                    positions={[
                      [userLocation.lat, userLocation.lon],
                      [dest.latitude, dest.longitude]
                    ]}
                    color="var(--primary)"
                    dashArray="5, 8"
                    weight={3}
                  />
                </>
              )}
            </MapContainer>
          </div>
        </div>

        {/* Alert Control Panel */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem' }}>Proximity Alert Controls</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div 
              className="switch-container" 
              onClick={() => {
                if (!dest.contactNumber) return;
                onToggleNotifyContact();
              }}
              style={{ opacity: dest.contactNumber ? 1 : 0.5 }}
            >
              <div className={`switch-track ${notifyContact ? 'active' : ''}`}>
                <div className="switch-thumb"></div>
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem' }}>Notify Contact via SMS</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Sends a text to {dest.contactNumber || 'None saved'} upon arrival.
                </span>
              </div>
            </div>

            {!dest.contactNumber && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.08)', color: '#fca5a5', padding: '0.5rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem' }}>
                <MessageSquare size={14} style={{ flexShrink: 0 }} />
                <span>You must save a contact number for this destination to enable SMS alerts.</span>
              </div>
            )}

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>How Tracking Works:</h4>
              <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li>Fires a loud <strong>Geofence Alarm</strong> when you enter the 5km boundary zone.</li>
                <li>Operates continuously in the background (even if you navigate to other tabs).</li>
                <li>Calculates live bearing & ETA relative to your speed.</li>
                <li>Logs your trip statistics directly to your history database.</li>
              </ul>
            </div>

            {isCurrentlyTrackingThis && (
              <div 
                style={{ 
                  background: 'rgba(16, 185, 129, 0.1)', 
                  border: '1px solid var(--success)', 
                  color: '#a7f3d0',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  lineHeight: 1.4
                }}
              >
                <strong>Alert Service Active:</strong> Watcher is monitoring your position. Keep this tab open to track your coordinates and receive proximity alerts.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
