const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config();

const fs = require('fs');
const app = express();

// Ensure required directories exist on boot
const uploadDir = path.join(__dirname, 'uploads', 'pitch-decks');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('[Server] Created uploads/pitch-decks directory');
}

// Body parser & CORS
// ... body of server.js
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', platform: 'GoodMatter', timestamp: new Date().toISOString() });
});

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/startups', require('./routes/startups'));
app.use('/api/investor', require('./routes/investor'));
app.use('/api/founder', require('./routes/founder'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/services', require('./routes/services'));


// Server Setup
const PORT = process.env.PORT || 5001;

const { initCronJob } = require('./jobs/updateScoringCriteria');
const db = require('./config/db');
const jobQueue = require('./services/jobQueue');

app.listen(PORT, async () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  
  // 1. Initialize Bi-monthly cron
  initCronJob();

  // 2. Queue Recovery: Re-enqueue deals stuck in PROCESSING (e.g. after a server restart)
  try {
    const stuckDeals = await db.query("SELECT id, pitch_deck_file FROM DealSubmissions WHERE status = 'PROCESSING'");
    if (stuckDeals.rows.length > 0) {
      console.log(`[Server] Found ${stuckDeals.rows.length} stuck deals. Re-enqueuing for analysis...`);
      for (const deal of stuckDeals.rows) {
        if (deal.pitch_deck_file) {
          const filePath = path.join(__dirname, deal.pitch_deck_file);
          const jobQueue = require('./services/jobQueue');
          jobQueue.enqueue(deal.id, filePath);
        }
      }
    }
  } catch (err) {
    console.error('[Server] Failed to recover stuck deals:', err.message);
  }
});
