const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  // Check if token has been revoked
  if (!req.db) {
    return res.status(500).json({ error: 'Database connection not available.' });
  }

  req.db.get('SELECT * FROM revoked_tokens WHERE token = ?', [token], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error validating token.' });
    }
    if (row) {
      return res.status(401).json({ error: 'Session revoked. Please log in again.' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.id };
      next();
    } catch (ex) {
      res.status(400).json({ error: 'Invalid auth token.' });
    }
  });
};
