const express = require('express');
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/startups/apply
// @desc    Submit a new startup application
// @access  Private (Founder)
router.post('/apply', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'FOUNDER') {
      return res.status(403).json({ message: 'Access denied. Founders only.' });
    }

    const {
      startup_name,
      industry,
      stage,
      raise_amount,
      description,
      pitch_deck_url,
      financial_model_url
    } = req.body;

    // Validate
    if (!startup_name || !industry || !stage || !description) {
      return res.status(400).json({ message: 'Please provide required startup details' });
    }

    // Insert Startup
    const newStartup = await db.query(
      `INSERT INTO Startups (startup_name, industry, stage, raise_amount, description, pitch_deck_url, financial_model_url, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'PENDING') RETURNING *`,
      [startup_name, industry, stage, raise_amount, description, pitch_deck_url, financial_model_url]
    );

    const startup_id = newStartup.rows[0].id;

    // Check if founder record exists for this user, if not create one
    const founderCheck = await db.query('SELECT * FROM Founders WHERE user_id = $1', [req.user.id]);
    
    if (founderCheck.rows.length === 0) {
      await db.query(
        'INSERT INTO Founders (user_id, startup_id, role) VALUES ($1, $2, $3)',
        [req.user.id, startup_id, 'Founder']
      );
    } else {
      // Update their current active startup to this new one for simplicity
      await db.query(
        'UPDATE Founders SET startup_id = $1 WHERE user_id = $2',
        [startup_id, req.user.id]
      );
    }

    res.status(201).json({
      message: 'Startup application submitted successfully and is pending review.',
      startup: newStartup.rows[0]
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/startups/list
// @desc    List all approved startups
// @access  Private (Investor, Admin) / Public read-only preview
router.get('/list', async (req, res) => {
  try {
    // Optionally secure this with authMiddleware if you want true privacy
    const startups = await db.query(
      "SELECT id, startup_name, industry, stage, raise_amount, description FROM Startups WHERE status = 'APPROVED' ORDER BY created_at DESC"
    );
    res.json(startups.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/startups/:id
// @desc    Get specific startup details
// @access  Public or Private depending on strategy
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const startup = await db.query('SELECT * FROM Startups WHERE id = $1', [id]);
    
    if (startup.rows.length === 0) {
      return res.status(404).json({ message: 'Startup not found' });
    }

    res.json(startup.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
