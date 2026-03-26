const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');

// Import route files
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const scoreRoutes = require('./routes/scoreRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const drawRoutes = require('./routes/drawRoutes');
const charityRoutes = require('./routes/charityRoutes');
const winnerRoutes = require('./routes/winnerRoutes');

// Initialize Express app
const app = express();

// ── Middleware ───────────────────────────────────────────────
app.use(cors());                          // Allow cross-origin requests
app.use(express.json());                  // Parse JSON request bodies
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to DB before handling any request (for serverless environments)
let isConnected = false;
app.use(async (req, res, next) => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
  next();
});

// ── API Routes ──────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/draws', drawRoutes);
app.use('/api/charities', charityRoutes);
app.use('/api/winners', winnerRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AceImpact API is running' });
});

// ── Start Server (only when not on Vercel) ──────────────────
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5001;
  connectDB().then(() => {
    isConnected = true;
    app.listen(PORT, () => {
      console.log(`🚀 AceImpact server running on port ${PORT}`);
    });
  });
}

// Export for Vercel serverless
module.exports = app;
