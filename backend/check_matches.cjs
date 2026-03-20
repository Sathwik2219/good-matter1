const db = require('./config/db');

async function checkMatches() {
  const investors = await db.query("SELECT id, name FROM Users WHERE role = 'INVESTOR'");
  console.log('Investors:', investors.rows);
  
  const matches = await db.query("SELECT * FROM DealMatches");
  console.log('Total Matches:', matches.rows.length);
  
  const submissions = await db.query("SELECT id, startup_name, status FROM DealSubmissions");
  console.log('Total Submissions:', submissions.rows);
  
  process.exit(0);
}

checkMatches();
