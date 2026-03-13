const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const app = express();

// Body parser & CORS
app.use(express.json({ limit: '10mb' }));
app.use(cors());

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

// Server Setup
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
