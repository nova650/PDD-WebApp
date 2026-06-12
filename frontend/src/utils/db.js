// LocalStorage DB Wrapper simulating Room database & SharedPreferences

const KEYS = {
  DESTINATIONS: 'travelpal_destinations',
  TRIP_HISTORY: 'travelpal_trip_history',
  EMERGENCY_CONTACTS: 'travelpal_emergency_contacts',
  SOS_LOGS: 'travelpal_sos_logs'
};

// --- Destinations ---
export const getDestinations = () => {
  try {
    const data = localStorage.getItem(KEYS.DESTINATIONS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error reading destinations', e);
    return [];
  }
};

export const saveDestination = (dest) => {
  try {
    const list = getDestinations();
    if (dest.id) {
      // Update
      const index = list.findIndex(d => d.id === dest.id);
      if (index !== -1) {
        list[index] = { ...list[index], ...dest };
      }
    } else {
      // Insert
      dest.id = Date.now(); // Generate unique ID
      list.push(dest);
    }
    localStorage.setItem(KEYS.DESTINATIONS, JSON.stringify(list));
    return dest;
  } catch (e) {
    console.error('Error saving destination', e);
    return null;
  }
};

export const deleteDestination = (id) => {
  try {
    let list = getDestinations();
    list = list.filter(d => d.id !== id);
    localStorage.setItem(KEYS.DESTINATIONS, JSON.stringify(list));
    return true;
  } catch (e) {
    console.error('Error deleting destination', e);
    return false;
  }
};

export const deleteAllDestinations = () => {
  try {
    localStorage.setItem(KEYS.DESTINATIONS, JSON.stringify([]));
    return true;
  } catch (e) {
    console.error('Error deleting all destinations', e);
    return false;
  }
};

// --- Emergency Contacts ---
export const getEmergencyContacts = () => {
  try {
    const data = localStorage.getItem(KEYS.EMERGENCY_CONTACTS);
    return data ? JSON.parse(data) : { contact1: '', contact2: '', contact3: '' };
  } catch (e) {
    console.error('Error reading emergency contacts', e);
    return { contact1: '', contact2: '', contact3: '' };
  }
};

export const saveEmergencyContacts = (contacts) => {
  try {
    localStorage.setItem(KEYS.EMERGENCY_CONTACTS, JSON.stringify(contacts));
    return true;
  } catch (e) {
    console.error('Error saving emergency contacts', e);
    return false;
  }
};

// --- Trip History ---
export const getTripHistory = () => {
  try {
    const data = localStorage.getItem(KEYS.TRIP_HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error reading trip history', e);
    return [];
  }
};

export const addTripHistory = (trip) => {
  try {
    const list = getTripHistory();
    const newTrip = {
      id: Date.now(),
      destinationTitle: trip.title,
      destinationLocation: trip.location,
      arrivedAt: Date.now(),
      distanceTravelled: parseFloat(trip.distanceTravelled || 0),
      durationMinutes: parseInt(trip.durationMinutes || 0)
    };
    list.unshift(newTrip); // Put newest first
    localStorage.setItem(KEYS.TRIP_HISTORY, JSON.stringify(list));
    return newTrip;
  } catch (e) {
    console.error('Error adding trip history', e);
    return null;
  }
};

export const clearTripHistory = () => {
  try {
    localStorage.setItem(KEYS.TRIP_HISTORY, JSON.stringify([]));
    return true;
  } catch (e) {
    console.error('Error clearing trip history', e);
    return false;
  }
};

// --- SOS SMS Simulator Logs ---
export const getSosLogs = () => {
  try {
    const data = localStorage.getItem(KEYS.SOS_LOGS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const addSosLog = (message, contacts) => {
  try {
    const logs = getSosLogs();
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      message,
      contacts: [...contacts]
    };
    logs.unshift(newLog);
    // Limit to last 50 logs
    localStorage.setItem(KEYS.SOS_LOGS, JSON.stringify(logs.slice(0, 50)));
    return newLog;
  } catch (e) {
    return null;
  }
};

export const clearSosLogs = () => {
  try {
    localStorage.setItem(KEYS.SOS_LOGS, JSON.stringify([]));
    return true;
  } catch (e) {
    return false;
  }
};
