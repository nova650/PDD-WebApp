const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// GET /api/emergency - Get emergency contacts for active user
router.get('/', auth, (req, res) => {
  const db = req.db;
  const userId = req.user.id;

  db.get('SELECT contact1, contact2, contact3 FROM emergency_contacts WHERE userId = ?', [userId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error fetching emergency contacts.' });
    }
    // Return blank default if not created yet
    res.json(row || { contact1: '', contact2: '', contact3: '' });
  });
});

// POST /api/emergency - Save emergency contacts
router.post('/', auth, (req, res) => {
  const db = req.db;
  const userId = req.user.id;
  const { contact1, contact2, contact3 } = req.body;

  db.run(
    `INSERT INTO emergency_contacts (userId, contact1, contact2, contact3) 
     VALUES (?, ?, ?, ?) 
     ON CONFLICT(userId) DO UPDATE SET contact1 = excluded.contact1, contact2 = excluded.contact2, contact3 = excluded.contact3`,
    [userId, contact1 || '', contact2 || '', contact3 || ''],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Database error saving emergency contacts.' });
      }
      res.json({ success: true, contact1, contact2, contact3 });
    }
  );
});

module.exports = router;
