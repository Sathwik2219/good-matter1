const express = require('express');
const bcrypt  = require('bcryptjs');
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
// Only an authenticated ADMIN can create another admin account
router.post('/create-admin', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }
    const existing = await db.query('SELECT id FROM Users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }
    const hash = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO Users (name, email, password_hash, role) VALUES ($1, $2, $3, $4)',
      [name, email, hash, 'ADMIN']
    );
    res.status(201).json({ message: `Admin account created for ${email}. They can now log in at /admin/login.` });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ─── GET /api/admin/submissions ─── (StartupApplications legacy)
router.get('/submissions', authMiddleware, adminOnly, async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM StartupApplications ORDER BY created_at DESC`);
    res.json(result.rows);
  } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});

// ─── GET /api/admin/deals ─── (DealSubmissions — new comprehensive submissions)
router.get('/deals', authMiddleware, adminOnly, async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM DealSubmissions ORDER BY created_at DESC`);
    res.json(result.rows);
  } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});

// ─── PATCH /api/admin/deals/:id/approve ─── (DealSubmissions)
router.patch('/deals/:id/approve', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(`UPDATE DealSubmissions SET status = 'APPROVED' WHERE id = ?`, [id]);
    const sub = (await db.query(`SELECT * FROM DealSubmissions WHERE id = ?`, [id])).rows[0];
    if (sub && sub.filter_status === 'ELIGIBLE') {
      await runMatchingEngine(id, sub.industry, sub.stage);
    }
    res.json({ message: 'Deal approved and matched with relevant investors.' });
  } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});

// ─── PATCH /api/admin/deals/:id/reject ─── (DealSubmissions)
router.patch('/deals/:id/reject', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    await db.query(`UPDATE DealSubmissions SET status = 'REJECTED', rejection_reason = ? WHERE id = ?`, [reason || 'Does not meet current criteria', id]);
    res.json({ message: 'Deal rejected.' });
  } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});

// ─── PATCH /api/admin/startups/:id/approve ─────────────────────────────────
router.patch('/startups/:id/approve', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(`UPDATE StartupApplications SET status = 'APPROVED' WHERE id = ?`, [id]);

    // Optionally auto-add to Startups + Deals tables
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

// ─── PATCH /api/admin/startups/:id/reject ──────────────────────────────────
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

// ─── GET /api/admin/investors ─────────────────────────────────────────────
router.get('/investors', authMiddleware, adminOnly, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT u.id, u.name, u.email, u.role, COUNT(ir.id) as intro_requests
       FROM Users u
       LEFT JOIN Investors i ON i.user_id = u.id
       LEFT JOIN IntroductionRequests ir ON ir.investor_id = i.id
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

// ─── GET /api/admin/stats ─────────────────────────────────────────────────
router.get('/stats', authMiddleware, adminOnly, async (req, res) => {
  try {
    const [legacySubs, newDeals, investors, activeDeals, pendingApps, pendingDeals] = await Promise.all([
      db.query(`SELECT COUNT(*) as count FROM StartupApplications`),
      db.query(`SELECT COUNT(*) as count FROM DealSubmissions`),
      db.query(`SELECT COUNT(*) as count FROM Users WHERE role = 'INVESTOR'`),
      db.query(`SELECT COUNT(*) as count FROM Deals WHERE status = 'ACTIVE'`),
      db.query(`SELECT COUNT(*) as count FROM StartupApplications WHERE status = 'PENDING'`),
      db.query(`SELECT COUNT(*) as count FROM DealSubmissions WHERE status = 'PENDING'`),
    ]);
    res.json({
      totalSubmissions: (legacySubs.rows[0]?.count || 0) + (newDeals.rows[0]?.count || 0),
      legacyApplications: legacySubs.rows[0]?.count || 0,
      newDealSubmissions: newDeals.rows[0]?.count || 0,
      totalInvestors: investors.rows[0]?.count || 0,
      activeDeals: activeDeals.rows[0]?.count || 0,
      pendingReview: (pendingApps.rows[0]?.count || 0) + (pendingDeals.rows[0]?.count || 0),
    });
  } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});

module.exports = router;
