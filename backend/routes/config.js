const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// GET /api/config/maps-key - Safely serve Google Maps API Key to frontend with origin check
router.get('/maps-key', auth, (req, res) => {
  const referer = req.headers['referer'] || req.headers['referrer'];
  const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
  
  if (!referer || !referer.startsWith(allowedOrigin)) {
    return res.status(403).json({ error: 'Access forbidden. Unauthorized request origin.' });
  }

  res.json({
    mapsApiKey: process.env.MAPS_API_KEY || ''
  });
});

module.exports = router;
