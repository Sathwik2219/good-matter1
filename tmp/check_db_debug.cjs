const db = require('../backend/config/db');

async function check() {
  const all = await db.query(`SELECT id, submitted_by, email, startup_name, status FROM DealSubmissions ORDER BY id DESC LIMIT 5`);
  console.log('Latest DealSubmissions:', JSON.stringify(all.rows, null, 2));
  
  const users = await db.query(`SELECT id, name, email FROM Users ORDER BY id DESC LIMIT 5`);
  console.log('Latest Users:', JSON.stringify(users.rows, null, 2));
  
  process.exit(0);
}

check();
