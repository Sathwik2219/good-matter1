const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.all("SELECT id, startup_name, email, status, created_at FROM DealSubmissions ORDER BY created_at DESC LIMIT 5", (err, rows) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Recent Deal Submissions:");
    console.table(rows);
  }
  db.close();
});
