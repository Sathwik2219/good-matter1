const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');
const { sendVerificationEmail } = require('../utils/emailService');

const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ─── POST /api/auth/google ───────────────────────────────────────────────────
router.post('/google', async (req, res) => {
  try {
    const { idToken, role = 'INVESTOR', intent = 'login' } = req.body;
    if (!idToken) return res.status(400).json({ success: false, message: 'No Google token provided' });

    // Verify Google Token
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name } = payload;

    // Check if user exists
    let userResult = await db.query('SELECT * FROM Users WHERE email = $1', [email]);
    let user = userResult.rows[0];

    if (!user) {
      if (intent === 'login') {
        return res.status(404).json({ success: false, message: 'Account not found. Please sign up first.' });
      }
      // Create new verified user
      const insertRes = await db.query(
        'INSERT INTO Users (name, email, role, is_verified, auth_provider, password_hash) VALUES ($1, $2, $3, 1, $4, $5) RETURNING id',
        [name, email, role, 'google', 'GOOGLE_OAUTH']
      );
      user = { id: insertRes.rows[0].id, name, email, role, auth_provider: 'google' };
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ success: true, token, message: 'Google login successful' });
  } catch (err) {
    console.error('Google Auth Error:', err.message);
    res.status(500).json({ success: false, message: 'Google authentication failed' });
  }
});

// ─── POST /api/auth/signup ───────────────────────────────────────────────────
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    let userResult = await db.query('SELECT * FROM Users WHERE email = $1', [email]);
    if (userResult.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    // Note: Verification email is handled via Resend if needed, leaving as fully verified for now
    const insertRes = await db.query(
      'INSERT INTO Users (name, email, password_hash, role, is_verified, auth_provider) VALUES ($1, $2, $3, $4, 1, $5) RETURNING id',
      [name, email, hash, role || 'INVESTOR', 'local']
    );
    
    // Automatically login on signup
    const user = { id: insertRes.rows[0].id, name, email, role: role || 'INVESTOR' };
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user, message: 'Signup successful!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ─── POST /api/auth/login ────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    let userResult = await db.query('SELECT * FROM Users WHERE email = $1', [email]);
    let user = userResult.rows[0];

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // If user signed up via Google first, they won't have a valid manually typed password
    if (user.auth_provider === 'google' && user.password_hash === 'GOOGLE_OAUTH') {
        return res.status(400).json({ message: 'This account was created with Google. Please use Google Login.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

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


// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const result = await db.query('SELECT id, name, email, role FROM Users WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
