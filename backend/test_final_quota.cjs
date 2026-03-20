const path = require('path');
const analyzer = require('./services/pitchDeckAnalyzer');
const db = require('./config/db');

async function testSingle() {
  console.log("=== STARTING SINGLE QUOTA TEST (New IP) ===");
  const filePath = "e:\\Good Matter\\backend\\training_data\\ALPL Pitch Deck Final.pdf";
  const dummyId = 99999;

  try {
    // 1. Ensure DB has a record for our dummy ID (or it will throw on UPDATE)
    await db.query(`
      INSERT OR REPLACE INTO DealSubmissions (id, startup_name, email, industry, stage, status, submitted_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)`, [dummyId, "Quota Test Startup", "test@gm.com", "other", "seed", "PROCESSING", "Admin Test"]);

    console.log("Step 1: Database dummy inserted.");

    // 2. Run the analyzer (30s delay + Single Metadata check + Single Prompt)
    await analyzer.analyze(dummyId, filePath);

    // 3. Check result
    const { rows } = await db.query(`SELECT ai_score, status, analysis_json FROM DealSubmissions WHERE id = ?`, [dummyId]);
    const res = rows[0];
    
    if (res && res.status === 'ANALYZED') {
      console.log("Step 2: Analysis COMPLETE!");
      console.log("AI SCORE:", res.ai_score);
      console.log("EXTRACTED DATA PREVIEW:", res.analysis_json.substring(0, 200) + "...");
    } else {
      console.log("Step 2: FAILED OR STUCK. Check logs above.");
    }

  } catch (err) {
    console.error("CRITICAL TEST FAILURE:", err.message);
  } finally {
    process.exit(0);
  }
}

testSingle();
