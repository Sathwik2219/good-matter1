const fs = require('fs');
const path = require('path');

const criteriaPath = path.join(__dirname, '../data/scoringCriteria.json');

/**
 * Loads the latest benchmark data from JSON file.
 */
function loadBenchmarks() {
  try {
    const data = JSON.parse(fs.readFileSync(criteriaPath, 'utf8'));
    return data;
  } catch (error) {
    console.error('[Scoring] Failed to load benchmarks:', error.message);
    return null;
  }
}

/**
 * Returns a score out of 10 based on comparison with benchmark ranges.
 * 
 * @param {number} value - The extracted metric from the pitch deck.
 * @param {Object} benchmark - { poor, average, good }
 */
function scoreMetric(value, benchmark) {
  if (!value || isNaN(value)) return 2; // Baseline score for having zero/invalid data

  if (value >= benchmark.good) return 10;
  if (value >= benchmark.average) return 7;
  if (value >= benchmark.poor) return 5;
  
  return 2;
}

/**
 * Generates explainable feedback for a metric relative to market.
 */
function getMetricFeedback(metricName, value, benchmark) {
  if (!value || isNaN(value)) return `No ${metricName} found in pitch deck.`;

  if (value >= benchmark.good) return `Your ${metricName} is in the top decile for your stage/sector.`;
  if (value >= benchmark.average) return `Your ${metricName} is above average compared to current market standards.`;
  if (value >= benchmark.poor) return `Your ${metricName} is within industry standard range but has room to scale.`;
  
  return `Your ${metricName} is currently below the average benchmark for active investors.`;
}

/**
 * Calculates quantitative scores using logic-based benchmark comparison.
 * 
 * @param {string} sector - e.g. "fintech"
 * @param {string} stage - e.g. "seed"
 * @param {Object} metrics - { mrr_usd, growth_rate_percent, retention_percent }
 */
function calculateQuantitativeScores(sector, stage, metrics) {
  const criteria = loadBenchmarks();
  if (!criteria) return { traction: 0, financials: 0, market: 0, feedback: [] };

  const key = `${sector.toLowerCase()}_${stage.toLowerCase()}`;
  const bm = criteria.benchmarks[key] || criteria.benchmarks.default;
  
  // 1. Traction Score (composed of MRR, Growth, Retention)
  const mrrScore = scoreMetric(metrics.mrr_usd, bm.mrr);
  const growthScore = scoreMetric(metrics.growth_rate_percent, bm.growth);
  const retentionScore = scoreMetric(metrics.retention, bm.retention);
  
  const traction_pts = Math.round(((mrrScore * 0.5) + (growthScore * 0.3) + (retentionScore * 0.2)));
  
  // 2. Financials & Market (Simplified logic for now based on extracted fund ask vs valuation etc)
  // These stay mostly weighted by the qualitative extraction but can be adjusted
  
  const feedback = [
    getMetricFeedback('MRR', metrics.mrr_usd, bm.mrr),
    getMetricFeedback('Growth Rate', metrics.growth_rate_percent, bm.growth),
    getMetricFeedback('Retention', metrics.retention, bm.retention)
  ];

  return {
    traction_pts,
    feedback
  };
}

module.exports = {
  calculateQuantitativeScores
};
