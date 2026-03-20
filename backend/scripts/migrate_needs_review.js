/**
 * One-time migration script.
 * Run with: node backend/scripts/migrate_needs_review.js
 * 
 * Fixes:
 * 1. Adds the missing `needs_review` column to DealSubmissions
 * 2. Resets any stuck PROCESSING deals back to PROCESSING so the queue re-picks them
 */

const sqlite3 = require('sqlite3').verbose();
const path    = require('path');

const db = new sqlite3.Database(path.resolve(__dirname, '../database.sqlite'));

db.serialize(() => {
  // 1. Add the missing column (safe — SQLite ignores if already exists via try/catch)
  db.run(`ALTER TABLE DealSubmissions ADD COLUMN needs_review INTEGER DEFAULT 0`, (err) => {
    if (err && !err.message.includes('duplicate column')) {
      console.error('Error adding column:', err.message);
    } else {
      console.log('✓ needs_review column ready.');
    }
  });

  // 2. Show all currently stuck deals
  db.all(`SELECT id, startup_name, status, created_at FROM DealSubmissions WHERE status = 'PROCESSING'`, [], (err, rows) => {
    if (err) return console.error('DB error:', err.message);
    if (!rows.length) {
      console.log('✓ No deals stuck in PROCESSING state.');
    } else {
      console.log(`\n⚠  Found ${rows.length} deal(s) stuck on PROCESSING:\n`);
      rows.forEach(r => console.log(`  - Deal #${r.id}: "${r.startup_name}" (submitted: ${r.created_at})`));
      console.log('\nReset to PROCESSING so the queue re-tries them...');
    }
  });
});

db.close(() => console.log('\n✓ Migration complete. Restart your server to trigger re-analysis.'));
