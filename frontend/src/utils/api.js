const API_BASE_URL = 'http://localhost:5001/api';

const getHeaders = () => {
  const token = localStorage.getItem('travelpal_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'API Request failed');
    }
    return data;
  } catch (error) {
    console.error(`API Error in ${endpoint}:`, error.message);
    throw error;
  }
};

export const authAPI = {
  login: async (email, password) => {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      localStorage.setItem('travelpal_token', data.token);
      localStorage.setItem('travelpal_email', data.email);
      localStorage.setItem('travelpal_name', data.name || email.split('@')[0]);
    }
    return data;
  },

  signup: async (email, password, name) => {
    const data = await request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    if (data.token) {
      localStorage.setItem('travelpal_token', data.token);
      localStorage.setItem('travelpal_email', data.email);
      localStorage.setItem('travelpal_name', name || email.split('@')[0]);
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('travelpal_token');
    localStorage.removeItem('travelpal_email');
    localStorage.removeItem('travelpal_name');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('travelpal_token');
  },

  getEmail: () => {
    return localStorage.getItem('travelpal_email') || '';
  },

  getName: () => {
    return localStorage.getItem('travelpal_name') || '';
  },
};

export const scansAPI = {
  getAll: () => request('/trips'),
  create: (scan) => request('/trips', {
    method: 'POST',
    body: JSON.stringify(scan),
  }),
  deleteAll: () => request('/trips', {
    method: 'DELETE',
  }),
};
