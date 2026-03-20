const express = require('express');
const db      = require('../config/db');
const authMiddleware = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { notifyAdminNewDeal, sendOtpEmail } = require('../config/emailService');
const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const router  = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/pitch-decks'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `deck-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.ppt', '.pptx'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, PPT, and PPTX are allowed.'));
  }
};

const upload = multer({ 
  storage, 
  limits: { fileSize: 30 * 1024 * 1024 }, // 30MB
  fileFilter 
});

// ─── POST /api/founder/google ─────────────────────────────────────────────────
router.post('/google', async (req, res) => {
  try {
    const { idToken } = req.body;
    console.log('[Auth Debug] Received Google login request for Founder');
    
    if (!idToken) {
      console.log('[Auth Debug] Error: No ID token provided');
      return res.status(400).json({ success: false, message: 'No Google token provided' });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      console.error('[Auth Debug] Error: GOOGLE_CLIENT_ID is missing from environment variables!');
      return res.status(500).json({ success: false, message: 'Server configuration error' });
    }

    // Verify Google Token
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name } = payload;
    console.log(`[Auth Debug] Token verified for: ${email}`);

    // Check if user exists
    let userResult = await db.query('SELECT * FROM Users WHERE email = $1', [email]);
    let user = userResult.rows[0];

    const intent = req.body.intent || 'login';

    if (!user) {
      if (intent === 'login') {
        console.log(`[Auth Debug] Login failed: No account found for ${email}`);
        return res.status(404).json({ success: false, message: 'Account not found. Please sign up as a founder first.' });
      }
      
      console.log(`[Auth Debug] Creating new founder account for: ${email}`);
      // Create new verified founder
      const insertRes = await db.query(
        'INSERT INTO Users (name, email, role, is_verified, auth_provider, password_hash) VALUES ($1, $2, $3, 1, $4, $5) RETURNING id',
        [name, email, 'FOUNDER', 'google', 'GOOGLE_OAUTH']
      );
      user = { id: insertRes.rows[0].id, name, email, role: 'FOUNDER', auth_provider: 'google' };
    } else {
      console.log(`[Auth Debug] Existing user found: ${user.email} (Role: ${user.role})`);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: 'FOUNDER' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: 'FOUNDER' }, message: 'Google login successful' });
  } catch (err) {
    console.error('[Auth Debug] CRITICAL ERROR:', err);
    res.status(500).json({ success: false, message: 'Google authentication failed' });
  }
});

// ─── POST /api/founder/signup ────────────────────────────────────────────────
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Please enter all fields' });

    let existing = await db.query('SELECT * FROM Users WHERE email = $1', [email]);
    if (existing.rows.length > 0) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const insertRes = await db.query(
      'INSERT INTO Users (name, email, password_hash, role, is_verified, auth_provider) VALUES ($1, $2, $3, $4, 1, $5) RETURNING id',
      [name, email, hash, 'FOUNDER', 'local']
    );

    const user = { id: insertRes.rows[0].id, name, email, role: 'FOUNDER' };
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user, message: 'Founder account created!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ─── POST /api/founder/login ─────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Please enter all fields' });

    let userResult = await db.query("SELECT * FROM Users WHERE email = $1 AND role = 'FOUNDER'", [email]);
    let user = userResult.rows[0];

    if (!user) return res.status(400).json({ message: 'Invalid credentials or not a founder' });
    
    if (user.auth_provider === 'google' && user.password_hash === 'GOOGLE_OAUTH') {
        return res.status(400).json({ message: 'This account was created with Google. Please use Google Login.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    if (user.is_verified === 0) {
      return res.status(403).json({ message: 'Verify email', needsVerification: true });
    }

    const payload = { id: user.id, name: user.name, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: payload });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ─── POST /api/founder/send-otp ──────────────────────────────────────────────
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60000); // 10 minutes from now

    // Upsert into OTPs table
    await db.query(`
      INSERT INTO OTPs (email, otp, expires_at) 
      VALUES ($1, $2, $3)
      ON CONFLICT(email) DO UPDATE SET otp = excluded.otp, expires_at = excluded.expires_at, created_at = CURRENT_TIMESTAMP
    `, [email, otp, expiresAt.toISOString()]);

    // Send email
    await sendOtpEmail(email, otp);
    
    // DEVELOPMENT HELPER: Loudly log the OTP to the terminal
    console.log(`\n========================================`);
    console.log(`🔑 OTP GENERATED FOR ${email}: ${otp}`);
    console.log(`========================================\n`);

    res.json({ success: true, message: 'Code sent to your email.' });
  } catch (err) {
    console.error('Send OTP error:', err.message);
    res.status(500).json({ message: 'Failed to send code. Please try again.' });
  }
});

// ─── POST /api/founder/verify-otp ────────────────────────────────────────────
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and Code are required' });

    // Verify OTP
    const otpRes = await db.query('SELECT * FROM OTPs WHERE email = $1', [email]);
    const otpRecord = otpRes.rows[0];

    if (!otpRecord) return res.status(400).json({ message: 'Invalid or expired Code.' });
    if (otpRecord.otp !== otp) return res.status(400).json({ message: 'Incorrect Code.' });
    
    const now = new Date();
    const expiresAt = new Date(otpRecord.expires_at);
    if (now > expiresAt) return res.status(400).json({ message: 'Code has expired. Please request a new one.' });

    // OTP is valid! Delete it so it can't be reused.
    await db.query('DELETE FROM OTPs WHERE email = $1', [email]);

    // Check if user exists
    let userResult = await db.query("SELECT * FROM Users WHERE email = $1 AND role = 'FOUNDER'", [email]);
    let user = userResult.rows[0];

    if (!user) {
      // User doesn't exist – automatically sign them up!
      const insertRes = await db.query(
        "INSERT INTO Users (name, email, password_hash, role, is_verified, auth_provider) VALUES ($1, $2, 'OTP_AUTH', 'FOUNDER', 1, 'email') RETURNING id",
        [email.split('@')[0], email] // Default name to part of email
      );
      user = { id: insertRes.rows[0].id, name: email.split('@')[0], email, role: 'FOUNDER' };
    }

    // Generate Token
    const payload = { id: user.id, name: user.name, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ success: true, token, user: payload, message: 'Login successful' });
  } catch (err) {
    console.error('Verify OTP error:', err.message);
    res.status(500).json({ message: 'Server Verification Error' });
  }
});

// ─── POST /api/founder/submit-deal ───────────────────────────────────────────
router.post('/submit-deal', authMiddleware, upload.single('pitch_deck_file'), async (req, res) => {
  try {
    const b = req.body || {};
    const getVal = (v) => {
      if (Array.isArray(v)) return v[v.length - 1]?.trim() || '';
      return (v || '').trim();
    };

    const submitterName = getVal(b.submitted_by || b.founder_name || b.name);
    const email = getVal(b.email);
    const startup_name = getVal(b.startup_name);
    const industry = getVal(b.industry);
    const stage = getVal(b.stage);
    const description = getVal(b.description || b.problem || b.one_line_pitch);
    const funding_amount = getVal(b.funding_amount || b.raise_amount || b.raising);
    const pitch_deck_url = getVal(b.pitch_deck_url);
    const pitch_deck_file = req.file ? `/uploads/pitch-decks/${req.file.filename}` : null;

    if (!submitterName || !email || !startup_name || !industry || !stage || !description || !funding_amount) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    if (!pitch_deck_url && !pitch_deck_file) {
      return res.status(400).json({ message: 'Please provide a pitch deck (upload a file or provide a link).' });
    }

    const insertSql = `INSERT INTO DealSubmissions
      (submitted_by, email, startup_name, industry, stage, problem, solution, funding_amount, pitch_deck_url, pitch_deck_file, status, filter_status, ai_score)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id`;

    const result = await db.query(insertSql, [
      submitterName, email, startup_name, industry, stage, 
      description, description, funding_amount, pitch_deck_url, pitch_deck_file,
      'PROCESSING', 'PENDING', 0
    ]);

    const dealId = result.rows[0]?.id;

    if (dealId && pitch_deck_file) {
      const fullFilePath = path.join(__dirname, '..', pitch_deck_file);
      const jobQueue = require('../services/jobQueue');
      jobQueue.enqueue(dealId, fullFilePath);
    }

    res.status(201).json({ status: "PROCESSING", id: dealId, message: "Your pitch deck has been queued for AI analysis." });
    
    // Notify admin
    notifyAdminNewDeal({ founderName: submitterName, startupName: startup_name, industry, stage, aiScore: 0 });

  } catch (err) {
    console.error('Submit deal error:', err.message);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});


// ─── GET /api/founder/my-deals ──────────────────────────────────────────────
router.get('/my-deals', authMiddleware, async (req, res) => {
  try {
    const email = req.user.email;
    const deals = await db.query(
      'SELECT * FROM DealSubmissions WHERE email = $1 ORDER BY created_at DESC',
      [email]
    );
    res.json(deals.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── Matching Engine (upgraded: sector + stage + geography + investment_type) ─
async function runMatchingEngine(dealId, industry, stage, geography) {
  try {
    const profilesResult = await db.query(`SELECT * FROM InvestorProfiles`);
    const profiles = profilesResult.rows;

    for (const profile of profiles) {
      let matchScore = 0;
      const reasons = [];

      const preferredSectors    = JSON.parse(profile.preferred_sectors || '[]');
      const preferredStages     = JSON.parse(profile.preferred_stages  || '[]');
      const profileGeography    = (profile.geography || '').toLowerCase();
      const investmentType      = (profile.investment_type || '').toLowerCase();
      const dealGeography       = (geography || '').toLowerCase();

      // Sector match (50 pts)
      if (preferredSectors.length === 0 || preferredSectors.some(s =>
        (industry || '').toLowerCase().includes(s.toLowerCase()) ||
        s.toLowerCase().includes((industry || '').toLowerCase())
      )) {
        matchScore += 50;
        reasons.push('Sector match');
      }

      // Stage match (30 pts)
      if (preferredStages.length === 0 || preferredStages.some(s =>
        (stage || '').toLowerCase().includes(s.toLowerCase()) ||
        s.toLowerCase().includes((stage || '').toLowerCase())
      )) {
        matchScore += 30;
        reasons.push('Stage match');
      }

      // Geography match (10 pts — partial/flexible)
      if (!profileGeography || !dealGeography ||
          profileGeography.includes(dealGeography) || dealGeography.includes(profileGeography) ||
          profileGeography.includes('pan india') || profileGeography.includes('global')
      ) {
        matchScore += 10;
        reasons.push('Geography match');
      }

      // Investment type match (10 pts)
      if (!investmentType || investmentType.includes((industry || '').toLowerCase()) ||
          investmentType.includes('any') || investmentType.includes('all')
      ) {
        matchScore += 10;
        reasons.push('Investment type match');
      }

      if (matchScore > 0) {
        await db.query(
          `INSERT OR IGNORE INTO DealMatches (deal_id, investor_id, match_score, match_reason) VALUES (?,?,?,?)`,
          [dealId, profile.user_id, matchScore, reasons.join(', ')]
        );
      }
    }
  } catch (err) {
    console.error('Matching engine error:', err.message);
  }
}

// Multer error handler
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Max size is 30MB.' });
    }
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
});

module.exports = router;
module.exports.runMatchingEngine = runMatchingEngine;
