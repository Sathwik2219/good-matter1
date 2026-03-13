/**
 * GoodMatter AI Scoring Engine — v2.0
 * Multi-category startup evaluation scoring each dimension 0–10
 * Final score is weighted average scaled to 0–100
 */

const WEIGHTS = {
  team:        0.20,
  market:      0.20,
  product:     0.20,
  traction:    0.15,
  financials:  0.15,
  competition: 0.10,
};

function scoreTeam({ founder_name, industry }) {
  let score = 5;
  const signals = [];
  const risks = [];

  // Domain expertise from industry keyword matching
  const techIndustries = ['saas', 'ai', 'fintech', 'healthtech', 'edtech', 'deeptech', 'climate'];
  if (techIndustries.some(k => (industry || '').toLowerCase().includes(k))) {
    score += 2;
    signals.push('Domain expertise in high-growth tech sector');
  }
  if (founder_name && founder_name.split(' ').length >= 2) {
    score += 1;
    signals.push('Named founder provided');
  } else {
    risks.push('Limited founder background information provided');
  }

  return { score: Math.min(score, 10), signals, risks };
}

function scoreMarket({ market_size, industry }) {
  let score = 4;
  const signals = [];
  const risks = [];

  const text = (market_size || '').toLowerCase();
  if (text.includes('billion') || text.includes('$b') || text.includes('cr')) {
    score += 3;
    signals.push('Large addressable market indicated (Billion+ TAM)');
  } else if (text.includes('million') || text.includes('$m')) {
    score += 2;
    signals.push('Mid-size market opportunity');
  } else if (text.length > 30) {
    score += 1;
  } else {
    risks.push('Market size not quantified — reduces investor confidence');
  }

  const hotSectors = ['fintech', 'ai', 'saas', 'healthtech', 'climate', 'edtech', 'deeptech', 'b2b'];
  if (hotSectors.some(k => (industry || '').toLowerCase().includes(k))) {
    score += 2;
    signals.push('High-growth sector with strong investor interest');
  }

  return { score: Math.min(score, 10), signals, risks };
}

function scoreProduct({ problem, solution }) {
  let score = 4;
  const signals = [];
  const risks = [];

  const probWords = (problem || '').split(' ').length;
  const solWords  = (solution || '').split(' ').length;

  if (probWords > 20) { score += 2; signals.push('Clear problem articulation'); }
  else { risks.push('Problem statement needs more depth'); }

  if (solWords > 20) { score += 2; signals.push('Well-defined solution'); }
  else { risks.push('Solution description is too brief'); }

  const differentiators = ['ai', 'patent', 'proprietary', 'unique', 'only', 'first', 'platform'];
  if (differentiators.some(k => (solution || '').toLowerCase().includes(k))) {
    score += 1;
    signals.push('Product differentiation signals detected');
  }

  return { score: Math.min(score, 10), signals, risks };
}

function scoreTraction({ traction, revenue_metrics }) {
  let score = 3;
  const signals = [];
  const risks = [];

  const text = ((traction || '') + ' ' + (revenue_metrics || '')).toLowerCase();

  if (text.includes('revenue') || text.includes('arr') || text.includes('mrr')) {
    score += 3;
    signals.push('Revenue-generating business with measurable metrics');
  } else if (text.includes('user') || text.includes('customer') || text.includes('client')) {
    score += 2;
    signals.push('Active user or customer base');
  } else {
    risks.push('No clear traction metrics provided');
  }

  if (text.includes('growth') || text.includes('%') || text.includes('month')) {
    score += 2;
    signals.push('Growth metrics or momentum demonstrated');
  }

  if (text.includes('waitlist') || text.includes('beta') || text.includes('pilot')) {
    score += 1;
    signals.push('Early traction: waitlist or pilot users');
  }

  return { score: Math.min(score, 10), signals, risks };
}

function scoreFinancials({ financial_projection, funding_amount, business_model }) {
  let score = 4;
  const signals = [];
  const risks = [];

  const text = ((financial_projection || '') + ' ' + (business_model || '')).toLowerCase();

  if (text.includes('saas') || text.includes('subscription') || text.includes('recurring')) {
    score += 2;
    signals.push('Recurring revenue model — strong unit economics potential');
  } else if (text.includes('marketplace') || text.includes('transaction') || text.includes('commission')) {
    score += 1;
    signals.push('Transaction-based revenue model');
  }

  if (text.includes('profitable') || text.includes('breakeven') || text.includes('positive')) {
    score += 2;
    signals.push('Path to profitability articulated');
  }

  if (text.includes('projection') || text.includes('forecast') || text.includes('year')) {
    score += 1;
    signals.push('Financial projections provided');
  } else {
    risks.push('Financial projections not provided');
  }

  const raiseNum = parseFloat((funding_amount || '0').replace(/[^\d.]/g, ''));
  if (raiseNum > 0 && raiseNum <= 10) {
    score += 1;
    signals.push('Right-sized seed raise for stage');
  } else if (raiseNum > 10 && raiseNum <= 50) {
    score += 0.5;
  } else if (raiseNum > 50) {
    risks.push('Large raise may require stronger proof points');
  }

  return { score: Math.min(score, 10), signals, risks };
}

function scoreCompetition({ competition }) {
  let score = 5;
  const signals = [];
  const risks = [];

  const text = (competition || '').toLowerCase();

  if (text.length < 20) {
    score -= 2;
    risks.push('Competitive landscape not addressed — major red flag for investors');
    return { score: Math.max(score, 1), signals, risks };
  }

  if (text.includes('moat') || text.includes('barrier') || text.includes('patent') || text.includes('network effect')) {
    score += 3;
    signals.push('Strong competitive moat identified');
  } else if (text.includes('advantage') || text.includes('better') || text.includes('faster')) {
    score += 2;
    signals.push('Competitive differentiation described');
  } else {
    score += 1;
    risks.push('Competitive defensibility could be stronger');
  }

  if (text.includes('fragmented') || text.includes('no direct')) {
    score += 1;
    signals.push('Fragmented market with room for a winner');
  }

  return { score: Math.min(score, 10), signals, risks };
}

/**
 * Main scoring function
 * @param {Object} data — startup submission data
 * @returns {{ ai_score: number, ai_breakdown: string, filter_status: string }}
 */
function scoreStartupV2(data) {
  const team        = scoreTeam(data);
  const market      = scoreMarket(data);
  const product     = scoreProduct(data);
  const traction    = scoreTraction(data);
  const financials  = scoreFinancials(data);
  const competition = scoreCompetition(data);

  const weightedScore =
    team.score        * WEIGHTS.team +
    market.score      * WEIGHTS.market +
    product.score     * WEIGHTS.product +
    traction.score    * WEIGHTS.traction +
    financials.score  * WEIGHTS.financials +
    competition.score * WEIGHTS.competition;

  const totalScore = Math.round(weightedScore * 10); // scale to 0–100

  // Determine filter status
  let filter_status = 'ELIGIBLE';
  if (totalScore < 50)       filter_status = 'AUTO_REJECTED';
  else if (totalScore <= 70) filter_status = 'REVIEW_NEEDED';

  // Market opportunity label
  let marketOpportunity = 'Moderate';
  if (totalScore >= 75) marketOpportunity = 'High';
  if (totalScore >= 85) marketOpportunity = 'Very High';
  if (totalScore < 50)  marketOpportunity = 'Low';

  // Investment potential label
  let investmentPotential = 'Monitor Progress';
  if (totalScore >= 80) investmentPotential = 'Strong Investment Candidate';
  else if (totalScore >= 65) investmentPotential = 'Promising — Needs Due Diligence';
  else if (totalScore >= 50) investmentPotential = 'Early Stage — Watch Closely';

  const breakdown = {
    scores: {
      team:        team.score,
      market:      market.score,
      product:     product.score,
      traction:    traction.score,
      financials:  financials.score,
      competition: competition.score,
    },
    total: totalScore,
    filter_status,
    marketOpportunity,
    investmentPotential,
    strengths: [
      ...team.signals,
      ...market.signals,
      ...product.signals,
      ...traction.signals,
      ...financials.signals,
      ...competition.signals,
    ],
    risks: [
      ...team.risks,
      ...market.risks,
      ...product.risks,
      ...traction.risks,
      ...financials.risks,
      ...competition.risks,
    ],
  };

  return {
    ai_score:     totalScore,
    ai_breakdown: JSON.stringify(breakdown),
    filter_status,
  };
}

module.exports = { scoreStartupV2 };
