const express = require('express');
const db      = require('../config/db');
const authMiddleware = require('../middleware/auth');
const { notifyAdminInvestorInterest } = require('../config/emailService');
const router  = express.Router();

// ─── GET /api/investor/dashboard ──────────────────────────────────────────────
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const [totalDeals, myInterests, categories, subscription] = await Promise.all([
      db.query(`SELECT COUNT(*) as count FROM Deals WHERE status = 'ACTIVE'`),
      db.query(`SELECT di.status, COALESCE(ds.startup_name, s.startup_name) as startup_name
                FROM DealInterest di
                LEFT JOIN DealSubmissions ds ON ds.id = di.deal_id
                LEFT JOIN Startups s ON s.id = di.deal_id
                WHERE di.investor_id = ?`, [req.user.id]),
      db.query(`SELECT deal_type as category, COUNT(*) as count FROM Deals WHERE status = 'ACTIVE' GROUP BY deal_type`),
      db.query(`SELECT * FROM Subscriptions WHERE user_id = ? AND status = 'ACTIVE'`, [req.user.id]),
    ]);

    res.json({
      investorName: req.user.name,
      totalActiveDeals: totalDeals.rows[0]?.count || 0,
      myIntroRequests: myInterests.rows || [],
      categoryBreakdown: categories.rows || [],
      subscription: subscription.rows[0] || null,
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

// ─── GET /api/investor/matched-deals ──────────────────────────────────────────
router.get('/matched-deals', authMiddleware, async (req, res) => {
  try {
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

// ─── GET /api/investor/my-interests ───────────────────────────────────────────
// Returns deal IDs that this investor has already expressed interest in
router.get('/my-interests', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT deal_id, status, created_at FROM DealInterest WHERE investor_id = ?`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ─── POST /api/investor/express-interest ──────────────────────────────────────
// New unified interest endpoint (replaces legacy request-intro)
router.post('/express-interest', authMiddleware, async (req, res) => {
  try {
    const { deal_id, startup_name, ai_score } = req.body;
    if (!deal_id) return res.status(400).json({ message: 'deal_id is required' });

    // Check for duplicate
    const existing = await db.query(
      `SELECT id FROM DealInterest WHERE deal_id = ? AND investor_id = ?`,
      [deal_id, req.user.id]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'You have already expressed interest in this deal.' });
    }

    // Store interest
    await db.query(
      `INSERT INTO DealInterest (deal_id, investor_id, status, notified_admin) VALUES (?,?,?,0)`,
      [deal_id, req.user.id, 'INTERESTED']
    );

    // Fetch investor email for notification
    const userResult = await db.query(`SELECT name, email FROM Users WHERE id = ?`, [req.user.id]);
    const investor = userResult.rows[0];

    // Send admin email notification (non-blocking)
    notifyAdminInvestorInterest({
      investorName: investor?.name || req.user.name,
      investorEmail: investor?.email || 'N/A',
      startupName: startup_name || `Deal #${deal_id}`,
      aiScore: ai_score || 'N/A',
    }).catch(console.error);

    // Mark as notified
    await db.query(
      `UPDATE DealInterest SET notified_admin = 1 WHERE deal_id = ? AND investor_id = ?`,
      [deal_id, req.user.id]
    );

    res.json({ message: 'Interest recorded! The GoodMatter team will coordinate the introduction within 48 hours.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ─── POST /api/investor/request-intro (legacy compatibility) ─────────────────
router.post('/request-intro', authMiddleware, async (req, res) => {
  try {
    const { startup_id } = req.body;
    if (!startup_id) return res.status(400).json({ message: 'startup_id required' });

    const existing = await db.query(
      `SELECT id FROM IntroductionRequests WHERE investor_id = ? AND startup_id = ?`,
      [req.user.id, startup_id]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Introduction already requested for this startup.' });
    }
    await db.query(
      `INSERT INTO IntroductionRequests (investor_id, startup_id, status) VALUES (?, ?, 'PENDING')`,
      [req.user.id, startup_id]
    );

    // Also record in DealInterest for unified tracking
    await db.query(
      `INSERT OR IGNORE INTO DealInterest (deal_id, investor_id, status, notified_admin) VALUES (?,?,?,0)`,
      [startup_id, req.user.id, 'INTERESTED']
    );

    // Send admin email
    const userResult = await db.query(`SELECT name, email FROM Users WHERE id = ?`, [req.user.id]);
    const investor = userResult.rows[0];
    const startupResult = await db.query(`SELECT startup_name FROM Startups WHERE id = ?`, [startup_id]);
    const startupName = startupResult.rows[0]?.startup_name || `Startup #${startup_id}`;

    notifyAdminInvestorInterest({
      investorName: investor?.name || req.user.name,
      investorEmail: investor?.email || 'N/A',
      startupName,
      aiScore: 'N/A (legacy deal)',
    }).catch(console.error);

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
      return res.json({
        user_id: req.user.id,
        preferred_sectors: '[]',
        preferred_stages: '[]',
        ticket_size: '', bio: '', linkedin_url: '',
        firm_name: '', role: '', geography: '', investment_type: '',
      });
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
    const {
      preferred_sectors, preferred_stages, ticket_size, bio,
      linkedin_url, firm_name, role, geography, investment_type,
    } = req.body;
    const sectors = JSON.stringify(Array.isArray(preferred_sectors) ? preferred_sectors : []);
    const stages  = JSON.stringify(Array.isArray(preferred_stages)  ? preferred_stages  : []);

    const existing = await db.query(`SELECT id FROM InvestorProfiles WHERE user_id = ?`, [req.user.id]);

    if (existing.rows.length > 0) {
      await db.query(
        `UPDATE InvestorProfiles
         SET preferred_sectors=?, preferred_stages=?, ticket_size=?, bio=?,
             linkedin_url=?, firm_name=?, role=?, geography=?, investment_type=?
         WHERE user_id=?`,
        [sectors, stages, ticket_size || null, bio || null, linkedin_url || null,
         firm_name || null, role || null, geography || null, investment_type || null, req.user.id]
      );
    } else {
      await db.query(
        `INSERT INTO InvestorProfiles
          (user_id, preferred_sectors, preferred_stages, ticket_size, bio, linkedin_url, firm_name, role, geography, investment_type)
         VALUES (?,?,?,?,?,?,?,?,?,?)`,
        [req.user.id, sectors, stages, ticket_size || null, bio || null, linkedin_url || null,
         firm_name || null, role || null, geography || null, investment_type || null]
      );
    }
    res.json({ message: 'Profile updated successfully!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
