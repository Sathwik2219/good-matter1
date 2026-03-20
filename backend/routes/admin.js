const express = require('express');
const bcrypt = require('bcryptjs');
const db      = require('../config/db');
const authMiddleware = require('../middleware/auth');
const { runMatchingEngine } = require('./founder');
const router  = express.Router();

// Admin middleware — must be ADMIN role
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

// ─── POST /api/admin/create-admin ─────────────────────────────────────────────
router.post('/create-admin', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email, and password are required.' });

    const existing = await db.query('SELECT id FROM Users WHERE email = $1', [email]);
    if (existing.rows.length > 0)
      return res.status(400).json({ message: 'An account with this email already exists.' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await db.query(
      'INSERT INTO Users (name, email, role, auth_provider, password_hash) VALUES (?, ?, ?, ?, ?)',
      [name, email, 'ADMIN', 'local', hash]
    );
    res.status(201).json({ message: `Admin account created for ${email}.` });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ─── POST /api/admin/create-investor ──────────────────────────────────────────
// Admin-only: create a new investor account with full profile
router.post('/create-investor', authMiddleware, adminOnly, async (req, res) => {
  try {
    const {
      name, email, password,
      firm_name, role, sector_preferences, stage_focus, ticket_size, geography, investment_type, bio, linkedin_url,
    } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'name, email, and password are required.' });

    const existing = await db.query('SELECT id FROM Users WHERE email = ?', [email]);
    if (existing.rows.length > 0)
      return res.status(400).json({ message: 'An investor account with this email already exists.' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create user with INVESTOR role
    const userResult = await db.query(
      'INSERT INTO Users (name, email, role, auth_provider, password_hash) VALUES (?, ?, ?, ?, ?) RETURNING id, name, email, role',
      [name, email, 'INVESTOR', 'local', hash]
    );
    const userId = userResult.rows[0]?.id;

    // Create Investors record
    await db.query('INSERT INTO Investors (user_id) VALUES (?)', [userId]);

    // Create InvestorProfile with all fields
    const sectors = JSON.stringify(Array.isArray(sector_preferences) ? sector_preferences : []);
    const stages  = JSON.stringify(Array.isArray(stage_focus) ? stage_focus : []);

    await db.query(
      `INSERT INTO InvestorProfiles
        (user_id, preferred_sectors, preferred_stages, ticket_size, bio, linkedin_url, firm_name, role, geography, stage_focus, investment_type)
       VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      [userId, sectors, stages, ticket_size || null, bio || null, linkedin_url || null,
       firm_name || null, role || null, geography || null, stages, investment_type || null]
    );

    res.status(201).json({ message: `Investor account created for ${name} (${email}). They can now log in.` });
  } catch (err) {
    console.error('Create investor error:', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ─── GET /api/admin/investors ─────────────────────────────────────────────────
router.get('/investors', authMiddleware, adminOnly, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT u.id, u.name, u.email, u.role,
              ip.firm_name, ip.geography, ip.ticket_size, ip.preferred_sectors, ip.preferred_stages,
              COUNT(di.id) as interest_count
       FROM Users u
       LEFT JOIN InvestorProfiles ip ON ip.user_id = u.id
       LEFT JOIN DealInterest di ON di.investor_id = u.id
       WHERE u.role = 'INVESTOR'
       GROUP BY u.id
       ORDER BY u.id DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ─── GET /api/admin/submissions ─── (StartupApplications legacy)
router.get('/submissions', authMiddleware, adminOnly, async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM StartupApplications ORDER BY created_at DESC`);
    res.json(result.rows);
  } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});

// ─── GET /api/admin/deals ─── (DealSubmissions — comprehensive submissions)
router.get('/deals', authMiddleware, adminOnly, async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM DealSubmissions ORDER BY created_at DESC`);
    res.json(result.rows);
  } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});

// ─── PATCH /api/admin/deals/:id/approve ───────────────────────────────────────
router.patch('/deals/:id/approve', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(`UPDATE DealSubmissions SET status = 'APPROVED' WHERE id = ?`, [id]);
    const sub = (await db.query(`SELECT * FROM DealSubmissions WHERE id = ?`, [id])).rows[0];
    if (sub) {
      await runMatchingEngine(id, sub.industry, sub.stage, sub.geography);
    }
    res.json({ message: 'Deal approved and matched with relevant investors.' });
  } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});

// ─── PATCH /api/admin/deals/:id/reject ────────────────────────────────────────
router.patch('/deals/:id/reject', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    await db.query(
      `UPDATE DealSubmissions SET status = 'REJECTED', rejection_reason = ? WHERE id = ?`,
      [reason || 'Does not meet current criteria', id]
    );
    res.json({ message: 'Deal rejected.' });
  } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});

// ─── PATCH /api/admin/startups/:id/approve ────────────────────────────────────
router.patch('/startups/:id/approve', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(`UPDATE StartupApplications SET status = 'APPROVED' WHERE id = ?`, [id]);

    const appResult = await db.query(`SELECT * FROM StartupApplications WHERE id = ?`, [id]);
    const app = appResult.rows[0];
    if (app) {
      const startupResult = await db.query(
        `INSERT INTO Startups (startup_name, industry, category, stage, raise_amount, description, founders, website)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [app.startup_name, app.industry, 'Angel / Early Stage', app.stage, app.raise_amount, app.description, app.founder_name, app.website || '']
      );
      const startupId = startupResult.rows[0]?.id;
      if (startupId) {
        await db.query(
          `INSERT INTO Deals (startup_id, status, deal_stage, deal_type) VALUES (?, 'ACTIVE', 'Open', 'Angel / Early Stage')`,
          [startupId]
        );
      }
    }
    res.json({ message: 'Startup approved and added to live dealflow.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ─── PATCH /api/admin/startups/:id/reject ─────────────────────────────────────
router.patch('/startups/:id/reject', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    await db.query(
      `UPDATE StartupApplications SET status = 'REJECTED', rejection_reason = ? WHERE id = ?`,
      [reason || 'Does not meet current criteria', id]
    );
    res.json({ message: 'Startup application rejected.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ─── GET /api/admin/interest-notifications ────────────────────────────────────
// List all investor interest requests (for admin review)
router.get('/interest-notifications', authMiddleware, adminOnly, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        di.id, di.status, di.notified_admin, di.created_at,
        u.name AS investor_name, u.email AS investor_email,
        ip.firm_name,
        COALESCE(ds.startup_name, s.startup_name) AS startup_name,
        COALESCE(ds.ai_score, 0) AS ai_score
      FROM DealInterest di
      JOIN Users u ON u.id = di.investor_id
      LEFT JOIN InvestorProfiles ip ON ip.user_id = u.id
      LEFT JOIN DealSubmissions ds ON ds.id = di.deal_id
      LEFT JOIN Startups s ON s.id = di.deal_id
      ORDER BY di.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ─── GET /api/admin/stats ─────────────────────────────────────────────────────
router.get('/stats', authMiddleware, adminOnly, async (req, res) => {
  try {
    const [legacySubs, newDeals, investors, activeDeals, pendingApps, pendingDeals, interests] = await Promise.all([
      db.query(`SELECT COUNT(*) as count FROM StartupApplications`),
      db.query(`SELECT COUNT(*) as count FROM DealSubmissions`),
      db.query(`SELECT COUNT(*) as count FROM Users WHERE role = 'INVESTOR'`),
      db.query(`SELECT COUNT(*) as count FROM Deals WHERE status = 'ACTIVE'`),
      db.query(`SELECT COUNT(*) as count FROM StartupApplications WHERE status = 'PENDING'`),
      db.query(`SELECT COUNT(*) as count FROM DealSubmissions WHERE status = 'PENDING'`),
      db.query(`SELECT COUNT(*) as count FROM DealInterest WHERE notified_admin = 0`),
    ]);
    res.json({
      totalSubmissions: (legacySubs.rows[0]?.count || 0) + (newDeals.rows[0]?.count || 0),
      legacyApplications: legacySubs.rows[0]?.count || 0,
      newDealSubmissions: newDeals.rows[0]?.count || 0,
      totalInvestors: investors.rows[0]?.count || 0,
      activeDeals: activeDeals.rows[0]?.count || 0,
      pendingReview: (pendingApps.rows[0]?.count || 0) + (pendingDeals.rows[0]?.count || 0),
      unreadInterests: interests.rows[0]?.count || 0,
    });
  } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});

module.exports = router;
