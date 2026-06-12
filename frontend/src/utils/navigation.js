// Navigation calculations (Distance, Bearing, ETA)

// Haversine formula to compute distance between coordinates in KM
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  
  const R = 6371; // Radius of earth in km
  const toRad = (value) => (value * Math.PI) / 180;
  
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  
  // Replicate RoundingMode.UP to 1 decimal place
  return Math.ceil(d * 10) / 10;
};

// Calculate compass bearing between coordinates
export const calculateBearing = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return '';

  const toRad = (value) => (value * Math.PI) / 180;
  const toDeg = (value) => (value * 180) / Math.PI;

  const dLon = toRad(lon2 - lon1);
  const lat1R = toRad(lat1);
  const lat2R = toRad(lat2);

  const x = Math.sin(dLon) * Math.cos(lat2R);
  const y = Math.cos(lat1R) * Math.sin(lat2R) - Math.sin(lat1R) * Math.cos(lat2R) * Math.cos(dLon);

  const deg = (toDeg(Math.atan2(x, y)) + 360) % 360;

  if (deg < 22.5) return '↑ N';
  if (deg < 67.5) return '↗ NE';
  if (deg < 112.5) return '→ E';
  if (deg < 157.5) return '↘ SE';
  if (deg < 202.5) return '↓ S';
  if (deg < 247.5) return '↙ SW';
  if (deg < 292.5) return '← W';
  if (deg < 337.5) return '↖ NW';
  return '↑ N';
};

// Calculate ETA based on speed (elapsed distance over elapsed time)
export const calculateEta = (currentDistance, initialDistance, tripStartTimeMs) => {
  if (!tripStartTimeMs || currentDistance >= initialDistance) return null;

  const elapsedMin = (Date.now() - tripStartTimeMs) / 60000.0;
  // Calculate if there's significant movement and elapsed time
  if (elapsedMin > 0.1) {
    const distanceCovered = initialDistance - currentDistance;
    const speedKmPerMin = distanceCovered / elapsedMin;
    if (speedKmPerMin > 0) {
      return Math.ceil(currentDistance / speedKmPerMin);
    }
  }
  return null;
};
