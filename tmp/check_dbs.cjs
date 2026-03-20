const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPaths = [
  './database.sqlite',
  './backend/database.sqlite'
];

async function checkDbs() {
  for (const dbPath of dbPaths) {
    console.log(`\nChecking DB: ${dbPath}`);
    const db = new sqlite3.Database(dbPath);
    
    await new Promise((resolve) => {
      db.all("SELECT id, name, email, role FROM Users WHERE email = 'admin@goodmatter.in'", [], (err, rows) => {
        if (err) {
          if (err.message.includes('no such table')) {
             console.log(' - No Users table found.');
          } else {
             console.log(` - Error: ${err.message}`);
          }
        } else if (rows && rows.length > 0) {
          console.log(` - Found admin user: ${JSON.stringify(rows[0])}`);
        } else {
          console.log(' - Admin user not found.');
        }
        db.close();
        resolve();
      });
    });
  }
}

checkDbs();
