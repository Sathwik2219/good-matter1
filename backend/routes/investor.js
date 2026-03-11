const express = require('express');
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/investor/deals — all active deals with enriched data
router.get('/deals', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'INVESTOR') {
      return res.status(403).json({ message: 'Access denied. Investors only.' });
    }
    const deals = await db.query(
      `SELECT d.id as deal_id, d.status as deal_status, d.deal_stage, d.deal_type, d.closing_date,
              s.id as startup_id, s.startup_name, s.industry, s.category, s.stage,
              s.raise_amount, s.description, s.founders, s.traction, s.website
       FROM Deals d
       JOIN Startups s ON d.startup_id = s.id
       WHERE d.status = 'ACTIVE'
       ORDER BY d.created_at DESC`
    );
    res.json(deals.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET /api/investor/dashboard — summary stats for the investor
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'INVESTOR') {
      return res.status(403).json({ message: 'Access denied. Investors only.' });
    }

    const totalDeals = await db.query(`SELECT COUNT(*) as count FROM Deals WHERE status = 'ACTIVE'`);
    const categoryCounts = await db.query(
      `SELECT s.category, COUNT(*) as count FROM Deals d
       JOIN Startups s ON d.startup_id = s.id
       WHERE d.status = 'ACTIVE'
       GROUP BY s.category`
    );

    // Intro requests by this investor
    const investorRow = await db.query('SELECT id FROM Investors WHERE user_id = $1', [req.user.id]);
    let introRequests = { rows: [] };
    if (investorRow.rows.length > 0) {
      introRequests = await db.query(
        `SELECT ir.status, s.startup_name FROM IntroductionRequests ir
         JOIN Startups s ON ir.startup_id = s.id
         WHERE ir.investor_id = $1`,
        [investorRow.rows[0].id]
      );
    }

    res.json({
      totalActiveDeals: totalDeals.rows[0]?.count || 0,
      categoryBreakdown: categoryCounts.rows,
      myIntroRequests: introRequests.rows,
      investorName: req.user.name,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST /api/investor/request-intro
router.post('/request-intro', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'INVESTOR') {
      return res.status(403).json({ message: 'Access denied. Investors only.' });
    }
    const { startup_id } = req.body;
    if (!startup_id) return res.status(400).json({ message: 'Please provide a startup_id' });

    // Auto-create investor profile if it doesn't exist
    let investorRow = await db.query('SELECT id FROM Investors WHERE user_id = $1', [req.user.id]);
    if (investorRow.rows.length === 0) {
      const newInvestor = await db.query('INSERT INTO Investors (user_id) VALUES ($1)', [req.user.id]);
      investorRow = { rows: [{ id: newInvestor.rows[0].id }] };
    }
    const investor_id = investorRow.rows[0].id;

    const checkReq = await db.query(
      'SELECT * FROM IntroductionRequests WHERE investor_id = $1 AND startup_id = $2',
      [investor_id, startup_id]
    );
    if (checkReq.rows.length > 0) {
      return res.status(400).json({ message: 'Introduction request already sent for this startup.' });
    }

    await db.query(
      'INSERT INTO IntroductionRequests (investor_id, startup_id, status) VALUES ($1, $2, $3)',
      [investor_id, startup_id, 'PENDING']
    );
    res.status(201).json({ message: 'Introduction requested successfully! Our team will be in touch.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
