// scripts/createAdmin.js
// Run: node scripts/createAdmin.js
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, '../database.sqlite'));

async function createAdmin() {
  const email = 'admin@goodmatter.com';
  const password = 'GoodMatter@Admin2026';
  const name = 'GoodMatter Admin';
  const role = 'ADMIN';

  const hash = await bcrypt.hash(password, 10);

  db.run(
    `INSERT OR REPLACE INTO Users (name, email, password_hash, role) VALUES (?, ?, ?, ?)`,
    [name, email, hash, role],
    function (err) {
      if (err) {
        console.error('Error creating admin:', err.message);
      } else {
        console.log('✅ Admin user created successfully!');
        console.log('   Email:    admin@goodmatter.com');
        console.log('   Password: GoodMatter@Admin2026');
        console.log('   Role:     ADMIN');
        console.log('   Login at: http://localhost:5173/login → then visit /admin');
      }
      db.close();
    }
  );
}

createAdmin();
