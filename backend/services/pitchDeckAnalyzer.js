const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
const path   = require('path');
const fs     = require('fs');
const { PDFParse } = require('pdf-parse');
const db     = require('../config/db');
const { calculateScore } = require('./scoringEngine');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// ─── OPTIMIZED PROMPT (minimal tokens) ──────────────────────────────────
const EXTRACTION_PROMPT = `Extract startup data from the text. Return JSON ONLY.
{
  "sector": "string", "stage": "string", "mrr_usd": number, "growth_rate": number, "retention": number,
  "users": number, "cac": number, "ltv": number, "competitors_count": number, "funding_ask_usd": number,
  "mrr_confidence": number, "growth_confidence": number,
  "qualitative": {
    "team_score": 0-10, "product_score": 0-10, "competition_score": 0-10, "market_score": 0-10, "financial_score": 0-10,
    "team_reasoning": "string", "product_reasoning": "string", "market_reasoning": "string"
  }
}`;

// ─── SINGLE PASS WRAPPER (with Retry) ──────────────────────────────────────
async function callGemini(model, content, attempts = 3) {
  for (let i = 0; i < attempts; i++) {
    try {
      return await model.generateContent(content);
    } catch (err) {
      const isQuota = (err.message || '').toLowerCase().includes('quota') || err.status === 429;
      if (isQuota && i < attempts - 1) {
        // Try to extract the retry duration from the error message (e.g. "Please retry in 59.67s")
        const retryMatch = err.message.match(/retry in ([\d.]+)s/);
        const retryDelay = retryMatch ? (parseFloat(retryMatch[1]) + 2) * 1000 : 5000;
        
        console.log(`[AI Worker] API Limit hit. Waiting ${Math.round(retryDelay/1000)}s... (Attempt ${i + 1}/${attempts})`);
        await new Promise(r => setTimeout(r, retryDelay));
        continue;
      }
      if (isQuota) {
        console.error(`[AI Worker] Gemini Quota Exhausted:`, err.message);
        err.message = "AI API quota reached. Please try again later.";
      }
      throw err;
    }
  }
}

function validateExtraction(data) {
  const flags = [];
  if (data.mrr_usd > 100_000_000)  flags.push('mrr_unrealistic');
  if (data.growth_rate > 500)       flags.push('growth_unrealistic');
  if (data.retention > 100)         flags.push('retention_over_100');
  return flags;
}

// ─── MAIN ANALYZE FUNCTION ───────────────────────────────────────────────────
async function analyze(dealId, filePath) {
  try {
    if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not configured.');

    // 1. Local Text Extraction (Saves massive tokens vs File API)
    console.log(`[AI Worker] Extracting text from Deal #${dealId}...`);
    const dataBuffer = fs.readFileSync(filePath);
    const parser     = new PDFParse({ data: dataBuffer });
    const pdfData    = await parser.getText();
    const text       = pdfData.text.substring(0, 8000); // Limit to 8k chars for extreme efficiency
    await parser.destroy(); // Free memory

    // 2. Call Gemini
    console.log(`[AI Worker] Analyzing Deal #${dealId} using gemini-2.0-flash (Text Only)...`);
    const model  = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      generationConfig: { maxOutputTokens: 500, temperature: 0.1 } 
    });

    const result = await callGemini(model, [
      { text: EXTRACTION_PROMPT },
      { text: `Pitch Deck Content:\n${text}` }
    ]);

    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Gemini failed to return JSON.');
    const extracted = JSON.parse(jsonMatch[0]);

    // 3. Process & Save
    const validationFlags = validateExtraction(extracted);
    await finalizeAnalysis(dealId, extracted, validationFlags);
    console.log(`[AI Worker] ✓ Deal #${dealId} complete (Live Analysis).`);

  } catch (err) {
    console.error(`[AI Worker] ✗ Deal #${dealId} failed:`, err.message);
    try {
      await db.query(
        `UPDATE DealSubmissions SET status = 'FAILED', error_message = ? WHERE id = ?`,
        [err.message, dealId]
      );
    } catch {}
  }
}

/**
 * Shared helper to compute score and update database.
 */
async function finalizeAnalysis(dealId, extracted, validationFlags = []) {
  const { total_score, tier, breakdown } = calculateScore(extracted);
  const lowConfidence = (extracted.mrr_confidence < 0.7) || (extracted.growth_confidence < 0.7);
  const needsReview   = validationFlags.length > 0 || lowConfidence;

  await db.query(`
    UPDATE DealSubmissions
    SET
      status            = ?,
      ai_score          = ?,
      tier              = ?,
      team_score        = ?,
      market_score      = ?,
      traction_score    = ?,
      product_score     = ?,
      competition_score = ?,
      financial_score   = ?,
      analysis_json     = ?,
      needs_review      = ?
    WHERE id = ?`, [
    'ANALYZED', total_score, tier,
    breakdown.team, breakdown.market, breakdown.traction,
    breakdown.product, breakdown.competition, breakdown.financial,
    JSON.stringify({ ...extracted, scored_at: new Date().toISOString() }),
    needsReview ? 1 : 0, dealId
  ]);
}

module.exports = { analyze };
