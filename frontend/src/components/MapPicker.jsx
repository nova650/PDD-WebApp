import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom Marker Icons using pure SVG Data URIs to prevent Vite bundler asset-load errors
const targetIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="%23ef4444" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

// Helper component to update map view center dynamically
function ChangeMapView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] !== 0 && center[1] !== 0) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
}

// Helper component to handle map click events
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapPicker({ lat, lon, onChangeLocation }) {
  const center = [lat || 37.7749, lon || -122.4194]; // Default to SF if empty

  const handleMapClick = async (clickedLat, clickedLon) => {
    onChangeLocation(clickedLat, clickedLon, "Fetching address...");
    try {
      // Reverse geocoding using OSM free Nominatim API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${clickedLat}&lon=${clickedLon}`
      );
      if (response.ok) {
        const data = await response.json();
        const address = data.display_name || `Location (${clickedLat.toFixed(4)}, ${clickedLon.toFixed(4)})`;
        onChangeLocation(clickedLat, clickedLon, address);
      } else {
        onChangeLocation(clickedLat, clickedLon, `Lat: ${clickedLat.toFixed(5)}, Lon: ${clickedLon.toFixed(5)}`);
      }
    } catch (e) {
      console.error(e);
      onChangeLocation(clickedLat, clickedLon, `Lat: ${clickedLat.toFixed(5)}, Lon: ${clickedLon.toFixed(5)}`);
    }
  };

  return (
    <div className="map-container-wrapper" style={{ height: '320px', position: 'relative' }}>
      <MapContainer 
        center={center} 
        zoom={lat ? 13 : 2} 
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeMapView center={center} />
        <MapClickHandler onMapClick={handleMapClick} />
        {lat !== 0 && lon !== 0 && (
          <Marker position={[lat, lon]} icon={targetIcon} />
        )}
      </MapContainer>
      <div 
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          background: 'rgba(10,11,16,0.85)',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '0.75rem',
          zIndex: 1000,
          border: '1px solid var(--border-color)',
          color: 'var(--text-secondary)'
        }}
      >
        Click anywhere on the map to set location coordinates.
      </div>
    </div>
  );
}
