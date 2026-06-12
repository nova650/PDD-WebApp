import React from 'react';
import { MapPin, Phone, Navigation, Edit, Trash2 } from 'lucide-react';
import { calculateDistance } from '../utils/navigation';

export default function DestinationCard({ dest, userLocation, onTrack, onEdit, onDelete }) {
  const distance = userLocation 
    ? calculateDistance(userLocation.lat, userLocation.lon, dest.latitude, dest.longitude)
    : null;

  return (
    <div className="glass-card dest-card">
      <div className="dest-card-header">
        <div>
          <h3 className="dest-card-title">{dest.title}</h3>
        </div>
        {distance !== null && (
          <span className="dest-card-dist">{distance} km</span>
        )}
      </div>

      <div className="dest-card-body">
        <div className="dest-card-info">
          <MapPin size={16} className="nav-item-icon" style={{ color: 'var(--primary)', flexShrink: 0 }} />
          <span>{dest.location || 'No address provided'}</span>
        </div>
        {dest.contactNumber && (
          <div className="dest-card-info">
            <Phone size={16} className="nav-item-icon" style={{ color: 'var(--secondary)', flexShrink: 0 }} />
            <span>{dest.contactNumber}</span>
          </div>
        )}
      </div>

      <div className="dest-card-footer">
        <button 
          className="btn btn-secondary" 
          onClick={(e) => {
            e.stopPropagation();
            onEdit(dest);
          }}
          title="Edit Destination"
          style={{ padding: '0.5rem' }}
        >
          <Edit size={16} />
        </button>
        <button 
          className="btn btn-secondary" 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(dest.id);
          }}
          title="Delete Destination"
          style={{ padding: '0.5rem', color: 'var(--danger)' }}
        >
          <Trash2 size={16} />
        </button>
        <button 
          className="btn btn-primary" 
          onClick={(e) => {
            e.stopPropagation();
            onTrack(dest);
          }}
          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
        >
          <Navigation size={14} />
          Track
        </button>
      </div>
    </div>
  );
}
