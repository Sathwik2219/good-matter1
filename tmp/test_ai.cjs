const { analyzeStartup } = require('../backend/services/aiScoring');

async function testAI() {
  const dummyText = `
    Startup Name: EcoCharge
    Industry: Energy Tech / Sustainability
    Stage: Seed
    Team: Founded by experts in battery technology with 10+ years at Tesla.
    Product: Next-gen lithium-sulfur batteries with 5x energy density of current tech.
    Market: $500B energy storage market, growing at 20% CAGR.
    Traction: Prototype testing successful with 3 major EV manufacturers under NDA.
    Competition: Outperforms existing solid-state battery startups on cost and cycle life.
    Financials: Seeking ₹10Cr for pilot plant setup. Projecting ₹100Cr revenue by Year 3.
  `;
  
  console.log(`[TEST] Sending dummy text to Gemini Flash...`);
  try {
    const result = await analyzeStartup(dummyText);
    console.log(`[TEST] AI Analysis Result:\n`, JSON.stringify(result, null, 2));
    
    if (result.total_score && result.tier && result.analysis) {
      console.log(`[TEST] SUCCESS: AI returned structured JSON with all required fields.`);
    } else {
      console.log(`[TEST] FAILURE: Missing fields in AI response.`);
    }
  } catch (error) {
    console.error(`[TEST] AI Analysis Failed:`, error.message);
  }
}

testAI();
