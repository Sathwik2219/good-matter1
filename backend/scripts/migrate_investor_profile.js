const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Starting migration: Adding new fields to InvestorProfiles...');

db.serialize(() => {
  // Check if columns exist and add them if they don't
  db.all("PRAGMA table_info(InvestorProfiles)", (err, rows) => {
    if (err) {
      console.error('Error checking table info:', err);
      process.exit(1);
    }

    const columns = rows.map(r => r.name);
    const newColumns = [
      { name: 'firm_name', type: 'TEXT' },
      { name: 'role', type: 'TEXT' },
      { name: 'geography', type: 'TEXT' }
    ];

    newColumns.forEach(col => {
      if (!columns.includes(col.name)) {
        db.run(`ALTER TABLE InvestorProfiles ADD COLUMN ${col.name} ${col.type}`, (err) => {
          if (err) {
            console.error(`Error adding column ${col.name}:`, err.message);
          } else {
            console.log(`Column ${col.name} added successfully.`);
          }
        });
      } else {
        console.log(`Column ${col.name} already exists.`);
      }
    });
  });
});

setTimeout(() => {
  db.close();
  console.log('Migration completed.');
}, 2000);
