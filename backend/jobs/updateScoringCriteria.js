const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const db = require('../config/db');
const { calculateScore } = require('../services/scoringEngine');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const criteriaPath = path.join(__dirname, '../data/scoringCriteria.json');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Updates the scoringCriteria.json with new AI-driven market benchmarks.
 */
async function updateMarketBenchmarks() {
  try {
    console.log('[Cron] Fetching live market benchmarks from Gemini...');
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `
      You are a venture capital economist.
      Update the market benchmark ranges for Seed-stage startups (Fintech, SaaS, HealthTech) based on current 2024-2025 market trends in India and Global markets.

      Return ONLY a JSON object exactly matching this structure:
      {
        "last_updated": "YYYY-MM-DD",
        "benchmarks": {
          "fintech_seed": { 
            "mrr": { "poor": 2000, "average": 8000, "good": 25000 },
            "growth": { "poor": 10, "average": 25, "good": 40 },
            "retention": { "poor": 60, "average": 75, "good": 90 }
          },
          "saas_seed": { ... },
          "healthtech_seed": { ... },
          "default": { ... }
        }
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);
      fs.writeFileSync(criteriaPath, JSON.stringify(data, null, 2), 'utf8');
      console.log('[Cron] Successfully updated scoringCriteria.json with new AI benchmarks.');
    } else {
      throw new Error('Invalid AI response format for benchmarks.');
    }
  } catch (error) {
    console.error('[Cron] Failed to update benchmarks:', error.message);
  }
}

/**
 * Recalculates all startup scores in the DealSubmissions table based on new criteria.
 */
async function recalculateScores() {
  try {
    const deals = await db.query("SELECT * FROM DealSubmissions WHERE status = 'ANALYZED'");
    console.log(`[Cron] Recalculating benchmark-driven scores for ${deals.rows.length} startups...`);

    for (const deal of deals.rows) {
      // 1. Re-run calculateScore using the STORED analysis_json from previous Gemini extraction
      let extractedData = {};
      try {
        extractedData = JSON.parse(deal.analysis_json || '{}');
      } catch { continue; }

      const { total_score, tier, breakdown } = calculateScore(extractedData);

      await db.query(`
        UPDATE DealSubmissions 
        SET ai_score = ?, 
            tier = ?,
            team_score = ?,
            market_score = ?,
            traction_score = ?,
            product_score = ?,
            competition_score = ?,
            financial_score = ?
        WHERE id = ?`, 
        [
          total_score, tier,
          breakdown.team, breakdown.market, breakdown.traction,
          breakdown.product, breakdown.competition, breakdown.financial,
          deal.id
        ]
      );
    }
    console.log('[Cron] Recalculation complete.');
  } catch (error) {
    console.error('[Cron] Failed to recalculate scores:', error.message);
  }
}

/**
 * Job executed on the 1st and 15th of every month.
 */
async function runUpdateJob() {
  console.log('[Cron] Starting bi-monthly scoring benchmark update...');
  await updateMarketBenchmarks();
  await recalculateScores();
  console.log('[Cron] Bi-monthly update finished successfully.');
}

// Map cron job schedule: At 00:00 on day-of-month 1 and 15.
function initCronJob() {
  cron.schedule('0 0 1,15 * *', async () => {
    await runUpdateJob();
  });
  console.log('[Server] Bi-monthly benchmark-driven scoring initialized.');
}

module.exports = { initCronJob, runUpdateJob };
