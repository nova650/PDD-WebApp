import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Save, MapPin, Search, Loader } from 'lucide-react';
import MapPicker from './MapPicker';

export default function AddDestination({ editingDest, onSave, onCancel }) {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [lat, setLat] = useState(0.0);
  const [lon, setLon] = useState(0.0);
  const [contact, setContact] = useState('');
  
  // Search Autocomplete States
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [error, setError] = useState('');
  
  // User Current Location Focus Coordinates
  const [userCenter, setUserCenter] = useState({ lat: 37.7749, lon: -122.4194 });
  const debounceTimer = useRef(null);

  const ORS_API_KEY = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjMzZWQ0MTQ4NGM5MDQzZGQ4OWViYTE1MDY0NDUzZGM0IiwiaCI6Im11cm11cjY0In0=';

  // 1. Auto-detect user current location on mount to pre-center the picker
  useEffect(() => {
    if (!editingDest && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const currentLat = pos.coords.latitude;
          const currentLon = pos.coords.longitude;
          setLat(currentLat);
          setLon(currentLon);
          setUserCenter({ lat: currentLat, lon: currentLon });
          setLocation(`Current Location (${currentLat.toFixed(4)}, ${currentLon.toFixed(4)})`);
        },
        (err) => console.log("Autocomplete GPS failed", err)
      );
    }
  }, [editingDest]);

  // Sync editing destination inputs
  useEffect(() => {
    if (editingDest) {
      setTitle(editingDest.title || '');
      setLocation(editingDest.location || '');
      setLat(editingDest.latitude || 0.0);
      setLon(editingDest.longitude || 0.0);
      setContact(editingDest.contactNumber || '');
    }
    setError('');
  }, [editingDest]);

  const handleMapLocationChange = (clickedLat, clickedLon, address) => {
    setLat(clickedLat);
    setLon(clickedLon);
    setLocation(address);
  };

  // 2. Fetch OpenRouteService Geocoding search autocomplete suggestions
  const fetchSuggestions = async (searchText) => {
    if (!searchText.trim() || searchText.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoadingSearch(true);
    try {
      // Prioritize results near user current location using focus point parameters
      const url = `https://api.openrouteservice.org/geocode/autocomplete?api_key=${ORS_API_KEY}&text=${encodeURIComponent(searchText)}&focus.point.lat=${userCenter.lat}&focus.point.lon=${userCenter.lon}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data.features) {
          setSuggestions(data.features);
        }
      }
    } catch (e) {
      console.error("OpenRouteService geocode search failed:", e);
    } finally {
      setLoadingSearch(false);
    }
  };

  // Debounce typing to prevent excessive API calls
  const handleLocationInputChange = (text) => {
    setLocation(text);
    setShowSuggestions(true);
    
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(text);
    }, 400);
  };

  // 3. Selection handler for dropdown choices
  const handleSelectSuggestion = (feature) => {
    const label = feature.properties.label || feature.properties.name || "Selected Location";
    // GeoJSON geometries use [lon, lat] format
    const [selectedLon, selectedLat] = feature.geometry.coordinates;

    setLat(selectedLat);
    setLon(selectedLon);
    setLocation(label);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSave = () => {
    if (!title.trim()) {
      setError('Please enter a destination Title.');
      return;
    }
    if (!location.trim() || lat === 0 || lon === 0) {
      setError('Please search for a destination address or select on the map.');
      return;
    }

    const payload = {
      title: title.trim(),
      location: location.trim(),
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
      contactNumber: contact.trim()
    };

    if (editingDest) {
      payload.id = editingDest.id;
    }

    onSave(payload);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <button className="btn btn-secondary" onClick={onCancel} style={{ padding: '0.5rem 1rem', marginBottom: '1rem' }}>
            <ArrowLeft size={16} /> Back
          </button>
          <h2 className="page-title">
            {editingDest ? 'Edit Destination' : 'Add Destination'}
          </h2>
          <p className="page-subtitle">
            Configure your destination boundary markers using OpenRouteService.
          </p>
        </div>
      </div>

      <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto', overflow: 'visible' }}>
        {error && (
          <div 
            style={{ 
              background: 'rgba(239,68,68,0.15)', 
              border: '1px solid var(--danger)', 
              color: '#fca5a5', 
              padding: '0.75rem 1rem', 
              borderRadius: 'var(--radius-md)', 
              marginBottom: '1.5rem',
              fontSize: '0.9rem'
            }}
          >
            {error}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Destination Title *</label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="e.g. Home, Office, Metro Station" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
          />
        </div>

        <div className="form-group">
          <label className="form-label">Contact Number (For proximity notifications)</label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="e.g. +91 98765 43210 (SMS sends automatically on arrival)" 
            value={contact} 
            onChange={(e) => setContact(e.target.value)} 
          />
        </div>

        {/* Live Search Autocomplete input */}
        <div className="form-group" style={{ position: 'relative', overflow: 'visible' }}>
          <label className="form-label">Search Destination Address (OpenRouteService Autocomplete)</label>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              className="form-input" 
              style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
              placeholder="Start typing coordinates or place names..." 
              value={location} 
              onChange={(e) => handleLocationInputChange(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
            />
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-muted)' }} />
            {loadingSearch && (
              <span style={{ position: 'absolute', right: '12px', top: '14px', fontSize: '0.75rem', color: 'var(--accent)' }}>
                Searching...
              </span>
            )}
          </div>

          {/* Autocomplete Dropdown List */}
          {showSuggestions && suggestions.length > 0 && (
            <div 
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                width: '100%',
                background: '#121420',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                marginTop: '0.25rem',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                zIndex: 9999,
                maxHeight: '220px',
                overflowY: 'auto'
              }}
            >
              {suggestions.map((feature, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleSelectSuggestion(feature)}
                  style={{
                    padding: '0.75rem 1rem',
                    cursor: 'pointer',
                    borderBottom: idx !== suggestions.length - 1 ? '1px solid var(--border-color)' : 'none',
                    fontSize: '0.85rem',
                    transition: 'background 0.2s',
                    color: 'white'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.03)'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  <MapPin size={12} color="var(--primary)" style={{ marginRight: '0.5rem', display: 'inline' }} />
                  {feature.properties.label || feature.properties.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Latitude</span>
            <input 
              type="number" 
              className="form-input" 
              style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }} 
              value={lat} 
              onChange={(e) => setLat(parseFloat(e.target.value) || 0)} 
            />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Longitude</span>
            <input 
              type="number" 
              className="form-input" 
              style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }} 
              value={lon} 
              onChange={(e) => setLon(parseFloat(e.target.value) || 0)} 
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Map Position Preview (Click Map directly to override)</label>
          <MapPicker lat={lat} lon={lon} onChangeLocation={handleMapLocationChange} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2.5rem' }}>
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={18} /> {editingDest ? 'Update Location' : 'Save Location'}
          </button>
        </div>
      </div>
    </div>
  );
}
