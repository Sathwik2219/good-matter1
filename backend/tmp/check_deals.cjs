const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.all("SELECT status, COUNT(*) as count FROM DealSubmissions GROUP BY status", [], (err, rows) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log("Status Counts:", JSON.stringify(rows, null, 2));
    
    db.all("SELECT id, status, ai_score, error_message FROM DealSubmissions WHERE status IN ('ANALYZED', 'FAILED', 'PROCESSING')", [], (err, deals) => {
        if (err) console.error(err);
        else console.log("Recent Deals:", JSON.stringify(deals, null, 2));
        db.close();
    });
});
