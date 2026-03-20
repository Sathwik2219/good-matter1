const db = require('./config/db');
const { runMatchingEngine } = require('./routes/founder');

async function reMatch() {
  console.log('--- RE-RUNNING MATCHING ENGINE ---');
  
  const deals = await db.query("SELECT id, industry, stage, status FROM DealSubmissions WHERE status IN ('APPROVED', 'FEE_PAID')");
  console.log(`Found ${deals.rows.length} approved/paid deals.`);
  
  for (const deal of deals.rows) {
    console.log(`Matching for Deal: ${deal.id} (${deal.industry})...`);
    await runMatchingEngine(deal.id, deal.industry, deal.stage, 'India');
  }
  
  const matches = await db.query("SELECT COUNT(*) as count FROM DealMatches");
  console.log(`Matching complete. Total matches in DB: ${matches.rows[0].count}`);
  
  process.exit(0);
}

reMatch();
