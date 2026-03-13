const express = require('express');
const db      = require('../config/db');
const authMiddleware = require('../middleware/auth');
const router  = express.Router();

// ─── GET /api/investor/dashboard ──────────────────────────────────────────────
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const investorRes = await db.query(
      `SELECT id FROM Investors WHERE user_id = ?`, [req.user.id]
    );
    const investorId = investorRes.rows[0]?.id;

    const [totalDeals, intros, categories] = await Promise.all([
      db.query(`SELECT COUNT(*) as count FROM Deals WHERE status = 'ACTIVE'`),
      db.query(`SELECT sa.startup_name, ir.status FROM IntroductionRequests ir
                JOIN Startups sa ON sa.id = ir.startup_id
                WHERE ir.investor_id = ?`, [investorId || 0]),
      db.query(`SELECT deal_type as category, COUNT(*) as count FROM Deals WHERE status = 'ACTIVE' GROUP BY deal_type`),
    ]);

    res.json({
      investorName: req.user.name,
      totalActiveDeals: totalDeals.rows[0]?.count || 0,
      myIntroRequests: intros.rows || [],
      categoryBreakdown: categories.rows || [],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ─── GET /api/investor/deals ──────────────────────────────────────────────────
router.get('/deals', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        d.id AS deal_id,
        s.id AS startup_id,
        s.startup_name,
        s.industry,
        s.category,
        s.stage,
        s.raise_amount,
        s.description,
        s.founders,
        s.traction,
        s.website,
        d.status AS deal_status,
        d.deal_type AS category,
        d.closing_date
      FROM Deals d
      JOIN Startups s ON s.id = d.startup_id
      WHERE d.status = 'ACTIVE'
      ORDER BY d.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ─── GET /api/investor/matched-deals ─────────────────────────────────────────
// Returns deals matched specifically to this investor via the matching engine
router.get('/matched-deals', authMiddleware, async (req, res) => {
  try {
    // Get DealSubmissions approved and matched to this investor
    const result = await db.query(`
      SELECT
        ds.id AS deal_id,
        ds.startup_name,
        ds.industry,
        ds.stage,
        ds.funding_amount AS raise_amount,
        ds.problem,
        ds.solution,
        ds.traction,
        ds.revenue_metrics,
        ds.ai_score,
        ds.ai_breakdown,
        ds.filter_status,
        dm.match_score,
        dm.match_reason,
        ds.created_at
      FROM DealMatches dm
      JOIN DealSubmissions ds ON ds.id = dm.deal_id
      WHERE dm.investor_id = ?
        AND ds.status IN ('APPROVED', 'PENDING')
      ORDER BY dm.match_score DESC, ds.ai_score DESC
    `, [req.user.id]);

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ─── POST /api/investor/request-intro ─────────────────────────────────────────
router.post('/request-intro', authMiddleware, async (req, res) => {
  try {
    const { startup_id } = req.body;
    if (!startup_id) return res.status(400).json({ message: 'startup_id required' });

    const investorRes = await db.query(
      `SELECT id FROM Investors WHERE user_id = ?`, [req.user.id]
    );
    const investorId = investorRes.rows[0]?.id;
    if (!investorId) return res.status(404).json({ message: 'Investor profile not found' });

    const existing = await db.query(
      `SELECT id FROM IntroductionRequests WHERE investor_id = ? AND startup_id = ?`,
      [investorId, startup_id]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Introduction already requested for this startup.' });
    }

    await db.query(
      `INSERT INTO IntroductionRequests (investor_id, startup_id, status) VALUES (?, ?, 'PENDING')`,
      [investorId, startup_id]
    );

    res.json({ message: 'Introduction request sent! The GoodMatter team will coordinate within 48 hours.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ─── GET /api/investor/profile ────────────────────────────────────────────────
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM InvestorProfiles WHERE user_id = ?`, [req.user.id]
    );
    if (result.rows.length === 0) {
      return res.json({ user_id: req.user.id, preferred_sectors: '[]', preferred_stages: '[]', ticket_size: '', bio: '', linkedin_url: '' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ─── PUT /api/investor/profile ────────────────────────────────────────────────
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { preferred_sectors, preferred_stages, ticket_size, bio, linkedin_url } = req.body;
    const sectors = JSON.stringify(Array.isArray(preferred_sectors) ? preferred_sectors : []);
    const stages  = JSON.stringify(Array.isArray(preferred_stages)  ? preferred_stages  : []);

    const existing = await db.query(`SELECT id FROM InvestorProfiles WHERE user_id = ?`, [req.user.id]);

    if (existing.rows.length > 0) {
      await db.query(
        `UPDATE InvestorProfiles SET preferred_sectors=?, preferred_stages=?, ticket_size=?, bio=?, linkedin_url=? WHERE user_id=?`,
        [sectors, stages, ticket_size || null, bio || null, linkedin_url || null, req.user.id]
      );
    } else {
      await db.query(
        `INSERT INTO InvestorProfiles (user_id, preferred_sectors, preferred_stages, ticket_size, bio, linkedin_url) VALUES (?,?,?,?,?,?)`,
        [req.user.id, sectors, stages, ticket_size || null, bio || null, linkedin_url || null]
      );
    }
    res.json({ message: 'Profile updated successfully!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
