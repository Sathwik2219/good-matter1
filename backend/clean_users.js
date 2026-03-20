const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Cleaning up accidentally created founder and investor accounts (using GOOGLE_OAUTH default password)...');

db.run("DELETE FROM Users WHERE password_hash = 'GOOGLE_OAUTH'", function(err) {
  if (err) {
    console.error('Error cleaning up users:', err);
  } else {
    console.log(`Successfully deleted ${this.changes} accidentally created users!`);
  }
  db.close();
});
