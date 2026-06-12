const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Enforce JWT_SECRET at startup
if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET environment variable is not defined.');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5001;

// Core Security Middlewares
app.use(helmet());

// Restrict CORS to specific origins
const whitelist = [process.env.FRONTEND_URL || 'http://localhost:5173'];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};
app.use(cors(corsOptions));

// Set Request Payload Limit (DoS prevention)
app.use(express.json({ limit: '10kb' }));

// Apply Rate Limiting to Auth Endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes.' }
});
app.use('/api/auth', authLimiter);


// Database connection
const dbPath = path.join(__dirname, 'db', 'database.sqlite');
// Ensure directory exists
const fs = require('fs');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening SQLite database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    initializeDatabase();
  }
});

// Create tables if they do not exist
function initializeDatabase() {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )
    `);

    // Destinations table
    db.run(`
      CREATE TABLE IF NOT EXISTS destinations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        title TEXT NOT NULL,
        location TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        contactNumber TEXT,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Trip History table
    db.run(`
      CREATE TABLE IF NOT EXISTS trip_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        destinationTitle TEXT NOT NULL,
        destinationLocation TEXT NOT NULL,
        arrivedAt INTEGER NOT NULL,
        distanceTravelled REAL NOT NULL,
        durationMinutes INTEGER NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Emergency Contacts table
    db.run(`
      CREATE TABLE IF NOT EXISTS emergency_contacts (
        userId INTEGER PRIMARY KEY,
        contact1 TEXT,
        contact2 TEXT,
        contact3 TEXT,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Revoked Tokens table
    db.run(`
      CREATE TABLE IF NOT EXISTS revoked_tokens (
        token TEXT PRIMARY KEY,
        expiresAt INTEGER NOT NULL
      )
    `);
  });
}

// Make db accessible to routes
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Import Routes
const authRouter = require('./routes/auth');
const destinationsRouter = require('./routes/destinations');
const tripsRouter = require('./routes/trips');
const emergencyRouter = require('./routes/emergency');
const configRouter = require('./routes/config');

// Mount Routes
app.use('/api/auth', authRouter);
app.use('/api/destinations', destinationsRouter);
app.use('/api/trips', tripsRouter);
app.use('/api/emergency', emergencyRouter);
app.use('/api/config', configRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});

module.exports = app;
