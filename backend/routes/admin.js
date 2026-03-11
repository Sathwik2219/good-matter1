const express = require('express');
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Middleware to check if user is admin
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

// @route   GET /api/admin/applications
// @desc    View pending startup submissions
// @access  Private (Admin)
router.get('/applications', [authMiddleware, adminOnly], async (req, res) => {
  try {
    const applications = await db.query(
      "SELECT * FROM Startups WHERE status = 'PENDING' ORDER BY created_at DESC"
    );
    res.json(applications.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/admin/approve-startup/:id
// @desc    Approve a startup application
// @access  Private (Admin)
router.post('/approve-startup/:id', [authMiddleware, adminOnly], async (req, res) => {
  try {
    const { id } = req.params;

    const startup = await db.query('SELECT * FROM Startups WHERE id = $1', [id]);
    if (startup.rows.length === 0) {
      return res.status(404).json({ message: 'Startup not found' });
    }

    // Update status
    await db.query("UPDATE Startups SET status = 'APPROVED' WHERE id = $1", [id]);

    // Create an entry in Deals table
    await db.query(
      "INSERT INTO Deals (startup_id, status, deal_stage) VALUES ($1, 'ACTIVE', 'Fundraising')",
      [id]
    );

    res.json({ message: 'Startup approved and added to active deals' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/admin/reject-startup/:id
// @desc    Reject a startup application
// @access  Private (Admin)
router.post('/reject-startup/:id', [authMiddleware, adminOnly], async (req, res) => {
  try {
    const { id } = req.params;

    const startup = await db.query('SELECT * FROM Startups WHERE id = $1', [id]);
    if (startup.rows.length === 0) {
      return res.status(404).json({ message: 'Startup not found' });
    }

    await db.query("UPDATE Startups SET status = 'REJECTED' WHERE id = $1", [id]);

    res.json({ message: 'Startup rejected' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
