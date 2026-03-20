const { calculateQuantitativeScores } = require('./marketScoring');

/**
 * Calculates the final AI score and assigns a Tier.
 * Now using Logic-Based Benchmark Comparison for Quantitative metrics.
 * 
 * @param {Object} extractedData - The raw data extracted by Gemini
 * @returns {Object} { total_score, tier, breakdown }
 */
function calculateScore(extractedData) {
  const {
    sector = "other",
    stage = "seed",
    mrr_usd = 0,
    growth_rate_percent = 0,
    retention = 0,
    qualitative = {
      team_score: 5,
      product_score: 5,
      competition_score: 5,
      market_score: 5,
      financial_score: 5,
      team_reasoning: "",
      product_reasoning: "",
      market_reasoning: ""
    }
  } = extractedData;

  // 1. Quantitative Benchmarking (Traction only for now)
  const qScores = calculateQuantitativeScores(sector, stage, {
    mrr_usd,
    growth_rate_percent,
    retention
  });

  // 2. Map weightages (Matches Section 5 of founder request)
  // Traction logic: Logic Score (out of 10) * 2 = 20 pts max
  const traction_pts = Math.min(qScores.traction_pts * 2, 20);

  // Qualitative scores: LLM Score (out of 10) * multiplier
  const team_pts        = Math.min((qualitative.team_score || 0) * 2, 20);      // Max 20
  const market_pts      = Math.min((qualitative.market_score || 0) * 2, 20);    // Max 20
  const product_pts     = Math.min((qualitative.product_score || 0) * 1.5, 15);  // Max 15
  const competition_pts = Math.min((qualitative.competition_score || 0) * 1.5, 15); // Max 15
  const financial_pts   = Math.min((qualitative.financial_score || 0) * 1.0, 10); // Max 10

  // 3. Compute final score
  const total_score = 
    Math.round(traction_pts +
    team_pts +
    market_pts +
    product_pts +
    competition_pts +
    financial_pts);

  const final_score = Math.min(Math.max(total_score, 0), 100);

  // Assign tier (New 80/60/40 ranges)
  let tier = 'REJECTED';
  if (final_score >= 80)      tier = 'TIER_1';
  else if (final_score >= 60) tier = 'TIER_2';
  else if (final_score >= 40) tier = 'TIER_3';

  return {
    total_score: final_score,
    tier,
    breakdown: {
      team: team_pts,
      market: market_pts,
      traction: traction_pts,
      product: product_pts,
      competition: competition_pts,
      financial: financial_pts,
      feedback: qScores.feedback
    }
  };
}

module.exports = {
  calculateScore
};
