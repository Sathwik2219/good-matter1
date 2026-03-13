const express = require('express');
const db      = require('../config/db');
const authMiddleware = require('../middleware/auth');
const { scoreStartupV2 } = require('../config/aiScoring');
const router  = express.Router();

// ─── POST /api/founder/apply (legacy compatibility) ───────────────────────────
router.post('/apply', async (req, res) => {
  try {
    const {
      founder_name, email, linkedin_url, startup_name, website,
      industry, stage, raise_amount, description, pitch_deck_url, additional_info,
    } = req.body;

    if (!founder_name || !email || !startup_name || !industry || !stage || !pitch_deck_url) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    const { ai_score, ai_breakdown, filter_status } = scoreStartupV2({
      founder_name, industry, stage,
      funding_amount: raise_amount,
      description,
      problem: description, solution: description,
    });

    await db.query(
      `INSERT INTO StartupApplications 
        (founder_name, email, linkedin_url, startup_name, website, industry, stage, raise_amount, description, pitch_deck_url, additional_info, status, ai_score, ai_summary)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [founder_name, email, linkedin_url || null, startup_name, website || null, industry, stage, raise_amount || null, description || null, pitch_deck_url, additional_info || null, filter_status === 'AUTO_REJECTED' ? 'REJECTED' : 'PENDING', ai_score, ai_breakdown]
    );

    res.status(201).json({
      message: 'Application submitted successfully! Our team will review and respond within 7 days.',
      ai_score,
      filter_status,
    });
  } catch (err) {
    console.error('Founder apply error:', err.message);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ─── POST /api/founder/submit-deal (new comprehensive deal submission) ─────────
router.post('/submit-deal', async (req, res) => {
  try {
    const {
      submitted_by, email, startup_name, industry, stage,
      problem, solution, market_size, business_model,
      traction, revenue_metrics, competition, financial_projection,
      funding_amount, pitch_deck_url,
    } = req.body;

    // Validation
    if (!submitted_by || !email || !startup_name || !industry || !stage) {
      return res.status(400).json({ message: 'Missing required fields: submitted_by, email, startup_name, industry, stage' });
    }
    if (!pitch_deck_url) {
      return res.status(400).json({ message: 'Pitch deck URL is required' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    // AI Scoring v2
    const { ai_score, ai_breakdown, filter_status } = scoreStartupV2({
      founder_name: submitted_by,
      industry, stage, problem, solution,
      market_size, business_model, traction,
      revenue_metrics, competition,
      financial_projection, funding_amount,
    });

    // Determine initial status based on filter
    const status = filter_status === 'AUTO_REJECTED' ? 'REJECTED'
                 : filter_status === 'ELIGIBLE'      ? 'APPROVED'
                 : 'PENDING';

    const result = await db.query(
      `INSERT INTO DealSubmissions
        (submitted_by, email, startup_name, industry, stage, problem, solution, market_size,
         business_model, traction, revenue_metrics, competition, financial_projection,
         funding_amount, pitch_deck_url, status, filter_status, ai_score, ai_breakdown)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [submitted_by, email, startup_name, industry, stage, problem || null, solution || null,
       market_size || null, business_model || null, traction || null, revenue_metrics || null,
       competition || null, financial_projection || null, funding_amount || null,
       pitch_deck_url, status, filter_status, ai_score, ai_breakdown]
    );

    const dealId = result.rows[0]?.id;

    // If eligible, auto-run matching engine
    if (filter_status === 'ELIGIBLE' && dealId) {
      await runMatchingEngine(dealId, industry, stage);
    }

    res.status(201).json({
      message: filter_status === 'AUTO_REJECTED'
        ? 'Your submission was received. Unfortunately it did not meet our current investment criteria.'
        : filter_status === 'REVIEW_NEEDED'
        ? 'Submission received! Our team will review it within 7 business days.'
        : 'Your deal has been approved and matched with relevant investors!',
      ai_score,
      filter_status,
    });
  } catch (err) {
    console.error('Submit deal error:', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ─── Matching Engine ──────────────────────────────────────────────────────────
async function runMatchingEngine(dealId, industry, stage) {
  try {
    const profilesResult = await db.query(`SELECT * FROM InvestorProfiles`);
    const profiles = profilesResult.rows;

    for (const profile of profiles) {
      let matchScore = 0;
      const reasons = [];

      const preferredSectors = JSON.parse(profile.preferred_sectors || '[]');
      const preferredStages  = JSON.parse(profile.preferred_stages  || '[]');

      // Sector match
      if (preferredSectors.length === 0 || preferredSectors.some(s =>
        (industry || '').toLowerCase().includes(s.toLowerCase()) ||
        s.toLowerCase().includes((industry || '').toLowerCase())
      )) {
        matchScore += 50;
        reasons.push('Sector match');
      }

      // Stage match
      if (preferredStages.length === 0 || preferredStages.some(s =>
        (stage || '').toLowerCase().includes(s.toLowerCase()) ||
        s.toLowerCase().includes((stage || '').toLowerCase())
      )) {
        matchScore += 50;
        reasons.push('Stage match');
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

module.exports = router;
module.exports.runMatchingEngine = runMatchingEngine;
