const db = require('../backend/config/db');
const { analyze } = require('../backend/services/pitchDeckAnalyzer');
const path = require('path');
const fs = require('fs');

async function runTest() {
  console.log('--- STARTING BACKGROUND AI PIPELINE TEST ---');
  
  // 1. Insert a mock deal submission with 'PROCESSING'
  let dealId;
  try {
    const insertResult = await db.query(
      `INSERT INTO DealSubmissions (submitted_by, email, startup_name, industry, stage, status) 
       VALUES (?, ?, ?, ?, ?, 'PROCESSING')`,
      ['Test Founder', 'testfounder@example.com', 'Test E2E Startup', 'EdTech', 'Seed']
    );
    dealId = insertResult.rows[0].id;
    console.log(`[Test] Inserted mock deal with ID: ${dealId}`);
  } catch (err) {
    console.error('Failed to insert mock deal:', err.message);
    return;
  }

  // Find a PDF in uploads
  const uploadsDir = path.join(__dirname, '../backend/uploads/pitch-decks');
  const files = fs.readdirSync(uploadsDir);
  const pdfFile = files.find(f => f.endsWith('.pdf'));

  if (!pdfFile) {
    console.error('[Test] No PDF file found in uploads directory for testing.');
    return;
  }

  const pdfPath = path.join(uploadsDir, pdfFile);
  console.log(`[Test] Using PDF for test: ${pdfPath}`);

  // 2. Run the analyzer
  try {
    console.log(`[Test] Triggering pitchDeckAnalyzer.analyze()`);
    await analyze(dealId, pdfPath);
  } catch (err) {
    console.error(`[Test] Analyzer failed:`, err.message);
  }

  // 3. Verify results in Database
  try {
    const verifyResult = await db.query(`SELECT * FROM DealSubmissions WHERE id = ?`, [dealId]);
    const deal = verifyResult.rows[0];
    console.log('\n--- VERIFICATION RESULT ---');
    console.log(`Status: ${deal.status}`);
    console.log(`AI Score: ${deal.ai_score}`);
    console.log(`Tier: ${deal.tier}`);
    console.log(`Team Score: ${deal.team_score}`);
    console.log(`Market Score: ${deal.market_score}`);
    console.log(`Analysis JSON exists: ${!!deal.analysis_json}`);
    if (deal.status === 'FAILED') console.log(`Error Message: ${deal.error_message}`);
  } catch (err) {
    console.error('Failed to verify DB result:', err.message);
  }
}

runTest();
