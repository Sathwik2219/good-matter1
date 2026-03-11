const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const app = express();

// Body parser & CORS
app.use(express.json());
app.use(cors());

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'GoodMatter API is running' });
});

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/startups', require('./routes/startups'));
app.use('/api/investor', require('./routes/investor'));
app.use('/api/admin', require('./routes/admin'));

// Server Setup
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
