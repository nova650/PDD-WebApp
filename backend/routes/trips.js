const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// GET /api/trips - Get trip history for logged-in user
router.get('/', auth, (req, res) => {
  const db = req.db;
  const userId = req.user.id;

  db.all(
    'SELECT * FROM trip_history WHERE userId = ? ORDER BY arrivedAt DESC',
    [userId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error reading trip history.' });
      }
      res.json(rows);
    }
  );
});

// POST /api/trips - Log a completed trip
router.post('/', auth, (req, res) => {
  const db = req.db;
  const userId = req.user.id;
  const { destinationTitle, destinationLocation, arrivedAt, distanceTravelled, durationMinutes } = req.body;

  if (!destinationTitle || !destinationLocation || !arrivedAt || distanceTravelled === undefined || durationMinutes === undefined) {
    return res.status(400).json({ error: 'Missing trip details fields.' });
  }

  const arrival = parseInt(arrivedAt, 10);
  const dist = parseFloat(distanceTravelled);
  const dur = parseInt(durationMinutes, 10);

  if (isNaN(arrival) || arrival < 0 || arrival > Date.now()) {
    return res.status(400).json({ error: 'arrivedAt must be a valid timestamp not in the future.' });
  }

  if (isNaN(dist) || dist < 0 || isNaN(dur) || dur < 0) {
    return res.status(400).json({ error: 'distanceTravelled and durationMinutes must be non-negative numbers.' });
  }

  if (destinationTitle.length > 100 || destinationLocation.length > 200) {
    return res.status(400).json({ error: 'Destination title or location exceeds safety length limits.' });
  }

  db.run(
    'INSERT INTO trip_history (userId, destinationTitle, destinationLocation, arrivedAt, distanceTravelled, durationMinutes) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, destinationTitle, destinationLocation, arrivedAt || Date.now(), distanceTravelled, durationMinutes],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Database error logging trip history.' });
      }
      res.status(201).json({
        id: this.lastID,
        userId,
        destinationTitle,
        destinationLocation,
        arrivedAt,
        distanceTravelled,
        durationMinutes
      });
    }
  );
});

// DELETE /api/trips - Clear all trip history for user
router.delete('/', auth, (req, res) => {
  const db = req.db;
  const userId = req.user.id;

  db.run('DELETE FROM trip_history WHERE userId = ?', [userId], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Database error clearing trip history.' });
    }
    res.json({ success: true, message: 'All trip history cleared successfully.' });
  });
});

module.exports = router;
