const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// GET /api/destinations - Get all destinations for logged-in user
router.get('/', auth, (req, res) => {
  const db = req.db;
  const userId = req.user.id;

  db.all('SELECT * FROM destinations WHERE userId = ?', [userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error reading destinations.' });
    }
    res.json(rows);
  });
});

// POST /api/destinations - Add new destination
router.post('/', auth, (req, res) => {
  const db = req.db;
  const userId = req.user.id;
  const { title, location, latitude, longitude, contactNumber } = req.body;

  if (!title || !location || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: 'Title, location, latitude, and longitude are required.' });
  }

  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  if (isNaN(lat) || lat < -90 || lat > 90 || isNaN(lng) || lng < -180 || lng > 180) {
    return res.status(400).json({ error: 'Latitude must be between -90 and 90, and longitude must be between -180 and 180.' });
  }

  if (title.length > 100 || location.length > 200 || (contactNumber && contactNumber.length > 30)) {
    return res.status(400).json({ error: 'Title, location, or contact number exceed safety length limits.' });
  }

  db.run(
    'INSERT INTO destinations (userId, title, location, latitude, longitude, contactNumber) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, title, location, latitude, longitude, contactNumber],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Database error creating destination.' });
      }
      res.status(201).json({
        id: this.lastID,
        userId,
        title,
        location,
        latitude,
        longitude,
        contactNumber
      });
    }
  );
});

// PUT /api/destinations/:id - Update existing destination
router.put('/:id', auth, (req, res) => {
  const db = req.db;
  const userId = req.user.id;
  const destId = req.params.id;
  const { title, location, latitude, longitude, contactNumber } = req.body;

  if (!title || !location || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: 'Title, location, latitude, and longitude are required.' });
  }

  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  if (isNaN(lat) || lat < -90 || lat > 90 || isNaN(lng) || lng < -180 || lng > 180) {
    return res.status(400).json({ error: 'Latitude must be between -90 and 90, and longitude must be between -180 and 180.' });
  }

  if (title.length > 100 || location.length > 200 || (contactNumber && contactNumber.length > 30)) {
    return res.status(400).json({ error: 'Title, location, or contact number exceed safety length limits.' });
  }

  db.run(
    'UPDATE destinations SET title = ?, location = ?, latitude = ?, longitude = ?, contactNumber = ? WHERE id = ? AND userId = ?',
    [title, location, latitude, longitude, contactNumber, destId, userId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Database error updating destination.' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Destination not found or unauthorized.' });
      }
      res.json({
        id: parseInt(destId),
        userId,
        title,
        location,
        latitude,
        longitude,
        contactNumber
      });
    }
  );
});

// DELETE /api/destinations/:id - Delete destination
router.delete('/:id', auth, (req, res) => {
  const db = req.db;
  const userId = req.user.id;
  const destId = req.params.id;

  db.run(
    'DELETE FROM destinations WHERE id = ? AND userId = ?',
    [destId, userId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Database error deleting destination.' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Destination not found or unauthorized.' });
      }
      res.json({ success: true, message: 'Destination deleted successfully.' });
    }
  );
});

// DELETE /api/destinations - Delete all destinations
router.delete('/', auth, (req, res) => {
  const db = req.db;
  const userId = req.user.id;

  db.run('DELETE FROM destinations WHERE userId = ?', [userId], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Database error clearing destinations.' });
    }
    res.json({ success: true, message: 'All destinations cleared.' });
  });
});

module.exports = router;
